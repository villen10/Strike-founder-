import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocFromServer,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AuditReport } from '../types/audit';

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore Connection as specified in skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is currently offline or unreachable.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Google Authentication
export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}

// Email/Password Registration
export async function signUpWithEmail(email: string, pass: string, displayName: string): Promise<User | null> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    if (credential.user) {
      await updateProfile(credential.user, { displayName });
      await syncUserProfile(credential.user);
    }
    return credential.user;
  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
}

// Email/Password Login
export async function signInWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    if (credential.user) {
      await syncUserProfile(credential.user);
    }
    return credential.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// User Profile sync
export async function syncUserProfile(user: User): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email || 'creator@youtube.studio',
        displayName: user.displayName || 'YouTube Creator',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userRef,
        {
          displayName: user.displayName || 'YouTube Creator',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Audit Report to Firestore
export async function saveAuditReportToCloud(report: AuditReport, user: User): Promise<string> {
  const reportDocId = report.id || `audit_${Date.now()}`;
  const path = `audit_reports/${reportDocId}`;
  try {
    const docRef = doc(db, 'audit_reports', reportDocId);
    await setDoc(docRef, {
      userId: user.uid,
      videoTitle: (report.videoTitle || 'Untitled Video Scan').slice(0, 200),
      overallRiskScore: report.overallRiskScore ?? 0,
      safetyGrade: report.safetyGrade,
      strictnessMode: report.strictnessMode,
      totalIssuesCount: report.totalIssuesCount ?? 0,
      summaryVerdictEn: (report.summaryVerdictEn || 'Scan completed').slice(0, 1500),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return reportDocId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export interface CloudAuditRecord {
  id: string;
  userId: string;
  userEmail?: string;
  videoTitle: string;
  overallRiskScore: number;
  safetyGrade: 'SAFE_TO_UPLOAD' | 'MONETIZATION_AT_RISK' | 'HIGH_STRIKE_RISK';
  strictnessMode: 'STANDARD' | 'PARANOID_ZERO_RISK';
  totalIssuesCount: number;
  summaryVerdictEn: string;
  scannedAt?: string;
  createdAt?: Timestamp | Date;
}

// Fetch user's audit reports
export async function fetchUserAuditReports(userId: string): Promise<CloudAuditRecord[]> {
  const path = 'audit_reports';
  try {
    const q = query(
      collection(db, 'audit_reports'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CloudAuditRecord, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Save Strike Appeal
export async function saveAppealToCloud(
  appeal: { videoTitle: string; policyType: string; appealLetter: string; status?: 'draft' | 'submitted' | 'approved' | 'rejected' },
  user: User
): Promise<string> {
  const appealId = `appeal_${Date.now()}`;
  const path = `saved_appeals/${appealId}`;
  try {
    const docRef = doc(db, 'saved_appeals', appealId);
    await setDoc(docRef, {
      userId: user.uid,
      videoTitle: appeal.videoTitle.slice(0, 200),
      policyType: appeal.policyType.slice(0, 100),
      appealLetter: appeal.appealLetter.slice(0, 10000),
      status: appeal.status || 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return appealId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export { onAuthStateChanged };
export type { User };
