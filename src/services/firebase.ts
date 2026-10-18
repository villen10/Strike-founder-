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
  initializeFirestore,
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
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AuditReport } from '../types/audit';
import type { TrackedChannel } from '../types/channelTracker';

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId || undefined
);

// Test Firestore Connection safely without throwing unhandled startup errors
async function testConnection() {
  try {
    // Only verify if online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.info('Operating in offline mode.');
      return;
    }
    await getDocFromServer(doc(db, 'test', 'connection')).catch((e) => {
      // Suppress network unavailable error in offline or sandbox preview
      console.info('Cloud Firestore offline cache active.');
    });
  } catch (error) {
    console.info('Cloud Firestore operates in offline cache mode.');
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
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-blocked'
    ) {
      console.warn('Google sign-in popup was closed or dismissed:', error.code);
      throw error;
    }
    console.error('Sign-in error:', error);
    throw error;
  }
}

// Google Authentication with YouTube Readonly Scope for Channel Stats & Real Studio Analytics
export async function signInWithGoogleYouTube(): Promise<{ user: User; accessToken?: string }> {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/youtube.readonly');
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return { user: result.user, accessToken };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-blocked'
    ) {
      console.warn('Google YouTube sign-in popup was closed or dismissed:', error.code);
      throw error;
    }
    console.error('Google YouTube Sign-in error:', error);
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

// Save Tracked YouTube Channel to Cloud Firestore (Strictly Isolated per User)
export async function saveTrackedChannelToCloud(channel: TrackedChannel, user: User): Promise<void> {
  const safeId = (channel.id || 'channel').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  const docId = safeId.startsWith('ch_') ? safeId : `ch_${safeId}`;
  const path = `tracked_channels/${docId}`;
  try {
    const docRef = doc(db, 'tracked_channels', docId);
    const existingSnap = await getDoc(docRef);
    const isExisting = existingSnap.exists();

    const channelPayload: Record<string, any> = {
      userId: user.uid,
      userEmail: user.email || 'creator@youtube.studio',
      channelId: channel.id,
      title: (channel.title || 'YouTube Channel').slice(0, 200),
      handle: (channel.handle || '@channel').slice(0, 100),
      url: (channel.customUrl || `https://www.youtube.com/${channel.handle}`).slice(0, 500),
      avatar: channel.avatar || '',
      bannerUrl: channel.banner || '',
      subscribers: channel.subscriberCount || 0,
      subscribersFormatted: channel.subscribers || '',
      totalViews: channel.totalViewsCount || 0,
      totalVideos: channel.videoCount || 0,
      isGoogleConnected: Boolean(channel.isGoogleConnected),
      videos: channel.videos || [],
      snapshots: channel.historySnapshots || [],
      lastSyncedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    if (!isExisting) {
      channelPayload.createdAt = serverTimestamp();
    }

    await setDoc(docRef, channelPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch all tracked channels owned by the authenticated creator
export async function fetchUserTrackedChannels(userId: string): Promise<TrackedChannel[]> {
  const path = 'tracked_channels';
  try {
    const q = query(
      collection(db, 'tracked_channels'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: data.channelId || d.id,
        handle: data.handle || '@channel',
        title: data.title || 'YouTube Channel',
        customUrl: data.url || '',
        avatar: data.avatar || '',
        banner: data.bannerUrl || '',
        subscribers: data.subscribersFormatted || `${data.subscribers || 0} subscribers`,
        subscriberCount: data.subscribers || 0,
        videoCount: data.totalVideos || (data.videos?.length || 0),
        totalViews: data.totalViews ? data.totalViews.toLocaleString() : '0',
        totalViewsCount: data.totalViews || 0,
        description: data.description || '',
        lastUpdated: Date.now(),
        total24hLikes: (data.videos || []).reduce((acc: number, v: any) => acc + (v.likes24h || 0), 0),
        total24hViews: (data.videos || []).reduce((acc: number, v: any) => acc + (v.views24h || 0), 0),
        total7dLikes: (data.videos || []).reduce((acc: number, v: any) => acc + (v.likes7d || 0), 0),
        total7dViews: (data.videos || []).reduce((acc: number, v: any) => acc + (v.views7d || 0), 0),
        videos: data.videos || [],
        historySnapshots: data.snapshots || [],
        isGoogleConnected: Boolean(data.isGoogleConnected),
        userId: data.userId,
        userEmail: data.userEmail,
        privacyProtected: true,
      } as TrackedChannel;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Delete a tracked channel owned by the authenticated creator
export async function deleteTrackedChannelFromCloud(channelId: string, user: User): Promise<void> {
  const safeId = channelId.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  const docId = safeId.startsWith('ch_') ? safeId : `ch_${safeId}`;
  const path = `tracked_channels/${docId}`;
  try {
    const docRef = doc(db, 'tracked_channels', docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export { onAuthStateChanged };
export type { User };
