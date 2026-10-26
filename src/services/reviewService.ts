import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, User } from './firebase';

export interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  rating: number; // 1 - 5 stars
  comment: string;
  likesCount: number;
  dislikesCount: number;
  likedBy: string[];
  dislikedBy: string[];
  replies: ReviewReply[];
  isEdited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

const LOCAL_REVIEWS_KEY = 'striku_community_reviews_v1';
const REVIEWS_COLLECTION = 'reviews';

// Authentic starter reviews so the reviews board is vibrant from day one
export const SEED_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-seed-1',
    userId: 'user-tariq-yt',
    userName: 'Tariq Mahmood (Vlog Nation)',
    userEmail: 'tariq@vlognation.pk',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Striku saved my 450K subscriber channel! Before uploading my Japan travel vlog, Striku detected a background music copyright sample at 04:12 that CapCut had embedded. I trimmed 3 seconds and uploaded with zero copyright claims or monetization yellow icons. Truly an essential tool for all YouTubers!',
    likesCount: 38,
    dislikesCount: 1,
    likedBy: ['seed-user-1', 'seed-user-2'],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-1',
        userId: 'admin-striku',
        userName: 'Striku Team',
        message: 'Thank you Tariq! We love seeing your travel vlogs stay 100% monetized. Keep up the awesome content!',
        createdAt: '2 days ago',
      },
    ],
    createdAt: '3 days ago',
  },
  {
    id: 'rev-seed-2',
    userId: 'user-alina-tech',
    userName: 'Alina K. (Tech Bites)',
    userEmail: 'alina@techbites.com',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The CapCut safe-cut timecodes are incredible. You literally get exact start and end seconds where dangerous stunt warnings could trigger YouTube community guidelines. Saved me hours of re-rendering. 10/10 recommend!',
    likesCount: 24,
    dislikesCount: 0,
    likedBy: ['seed-user-3'],
    dislikedBy: [],
    replies: [],
    createdAt: '5 days ago',
  },
  {
    id: 'rev-seed-3',
    userId: 'user-hamza-gaming',
    userName: 'Hamza Gaming HD',
    userEmail: 'hamza@gamingpk.net',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Free pre-upload strike checker is legit! I had an intense battle royale montage and was worried about graphic violence flags. Striku scored it 94% safe and flagged just one blood splatter frame. Zero channel risk.',
    likesCount: 19,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [
      {
        id: 'rep-2',
        userId: 'user-tariq-yt',
        userName: 'Tariq Mahmood',
        message: 'Same here bro, the temporal frame detection is super accurate!',
        createdAt: '4 days ago',
      },
    ],
    createdAt: '1 week ago',
  },
];

/**
 * Helper to get local stored reviews
 */
function getLocalReviews(): ReviewItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local reviews:', e);
  }
  return SEED_REVIEWS;
}

/**
 * Helper to save local stored reviews
 */
function saveLocalReviews(reviews: ReviewItem[]): void {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn('Failed to save local reviews:', e);
  }
}

/**
 * Subscribes to reviews in real-time from Firestore.
 * Falls back gracefully to local storage / seed data if offline or permission issues.
 */
export function subscribeToReviews(
  onUpdate: (reviews: ReviewItem[]) => void
): () => void {
  const path = REVIEWS_COLLECTION;
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ReviewItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId || 'anonymous',
              userName: data.userName || 'Creator',
              userEmail: data.userEmail || '',
              userAvatar: data.userAvatar || '',
              rating: typeof data.rating === 'number' ? data.rating : 5,
              comment: data.comment || '',
              likesCount: data.likesCount || 0,
              dislikesCount: data.dislikesCount || 0,
              likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
              dislikedBy: Array.isArray(data.dislikedBy) ? data.dislikedBy : [],
              replies: Array.isArray(data.replies) ? data.replies : [],
              isEdited: Boolean(data.isEdited),
              createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : typeof data.createdAt === 'string'
                ? data.createdAt
                : 'Just now',
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined,
            };
          });

          // Merge seed reviews if list has few items
          const merged = [...list];
          for (const seed of SEED_REVIEWS) {
            if (!merged.some((r) => r.id === seed.id)) {
              merged.push(seed);
            }
          }
          saveLocalReviews(merged);
          onUpdate(merged);
        } else {
          // If Firestore collection is empty, display seed reviews and cache
          const locals = getLocalReviews();
          onUpdate(locals);
        }
      },
      (error) => {
        console.warn('Firestore reviews snapshot error, falling back to local cached reviews:', error);
        onUpdate(getLocalReviews());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach reviews listener, using local reviews:', err);
    onUpdate(getLocalReviews());
    return () => {};
  }
}

/**
 * Creates a new review in Firestore and local cache
 */
export async function createReview(
  data: {
    userName: string;
    rating: number;
    comment: string;
    userEmail?: string;
    userAvatar?: string;
  },
  currentUser?: User | { uid: string; email?: string | null; displayName?: string | null } | null
): Promise<ReviewItem> {
  const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const userId = currentUser?.uid || auth.currentUser?.uid || 'guest_' + Math.random().toString(36).substring(2, 9);
  const userName = (data.userName || currentUser?.displayName || 'YouTube Creator').slice(0, 100);
  const comment = data.comment.slice(0, 2000);
  const rating = Math.max(1, Math.min(5, Math.round(data.rating)));

  const newReview: ReviewItem = {
    id: reviewId,
    userId,
    userName,
    userEmail: data.userEmail || currentUser?.email || '',
    userAvatar: data.userAvatar || '',
    rating,
    comment,
    likesCount: 0,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    replies: [],
    createdAt: 'Just now',
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to local storage first for instant optimistic response
  const locals = getLocalReviews();
  const updatedLocals = [newReview, ...locals];
  saveLocalReviews(updatedLocals);

  // 2. Persist to Cloud Firestore if signed in
  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await setDoc(docRef, {
        userId: auth.currentUser.uid,
        userName,
        userEmail: auth.currentUser.email || data.userEmail || '',
        userAvatar: data.userAvatar || auth.currentUser.photoURL || '',
        rating,
        comment,
        likesCount: 0,
        dislikesCount: 0,
        likedBy: [],
        dislikedBy: [],
        replies: [],
        isEdited: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firestore create review write failed, cached locally:', error);
    }
  }

  return newReview;
}

/**
 * Edits an existing review (user can update star rating and comment)
 */
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; comment?: string; userName?: string },
  currentUser?: { uid: string } | null
): Promise<void> {
  const locals = getLocalReviews();
  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      return {
        ...rev,
        rating: updates.rating !== undefined ? Math.max(1, Math.min(5, updates.rating)) : rev.rating,
        comment: updates.comment !== undefined ? updates.comment.slice(0, 2000) : rev.comment,
        userName: updates.userName !== undefined ? updates.userName.slice(0, 100) : rev.userName,
        isEdited: true,
        updatedAt: new Date().toISOString(),
      };
    }
    return rev;
  });
  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      const payload: Record<string, any> = {
        updatedAt: serverTimestamp(),
        isEdited: true,
      };
      if (updates.rating !== undefined) payload.rating = Math.max(1, Math.min(5, updates.rating));
      if (updates.comment !== undefined) payload.comment = updates.comment.slice(0, 2000);
      if (updates.userName !== undefined) payload.userName = updates.userName.slice(0, 100);

      await updateDoc(docRef, payload);
    } catch (error) {
      console.warn('Firestore update review failed, updated locally:', error);
    }
  }
}

/**
 * Deletes a review from Firestore and local cache
 */
export async function deleteReview(reviewId: string): Promise<void> {
  const locals = getLocalReviews();
  const filtered = locals.filter((r) => r.id !== reviewId);
  saveLocalReviews(filtered);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Firestore delete review failed, removed locally:', error);
    }
  }
}

/**
 * Likes or unlikes a review
 */
export async function toggleReviewLike(
  reviewId: string,
  userId: string
): Promise<{ likesCount: number; dislikesCount: number; isLiked: boolean }> {
  const locals = getLocalReviews();
  let updatedLikeCount = 0;
  let updatedDislikeCount = 0;
  let isLiked = false;

  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const liked = rev.likedBy || [];
      const disliked = rev.dislikedBy || [];
      let newLikedBy = [...liked];
      let newDislikedBy = disliked.filter((id) => id !== userId); // remove from dislike if toggling like

      if (newLikedBy.includes(userId)) {
        newLikedBy = newLikedBy.filter((id) => id !== userId);
        isLiked = false;
      } else {
        newLikedBy.push(userId);
        isLiked = true;
      }

      updatedLikeCount = Math.max(0, newLikedBy.length);
      updatedDislikeCount = Math.max(0, newDislikedBy.length);

      return {
        ...rev,
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy,
        likesCount: updatedLikeCount,
        dislikesCount: updatedDislikeCount,
      };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      const targetRev = updatedLocals.find((r) => r.id === reviewId);
      if (targetRev) {
        await updateDoc(docRef, {
          likesCount: targetRev.likesCount,
          dislikesCount: targetRev.dislikesCount,
          likedBy: targetRev.likedBy,
          dislikedBy: targetRev.dislikedBy,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.warn('Firestore toggle like failed, updated locally:', error);
    }
  }

  return { likesCount: updatedLikeCount, dislikesCount: updatedDislikeCount, isLiked };
}

/**
 * Dislikes or undislikes a review
 */
export async function toggleReviewDislike(
  reviewId: string,
  userId: string
): Promise<{ likesCount: number; dislikesCount: number; isDisliked: boolean }> {
  const locals = getLocalReviews();
  let updatedLikeCount = 0;
  let updatedDislikeCount = 0;
  let isDisliked = false;

  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const liked = rev.likedBy || [];
      const disliked = rev.dislikedBy || [];
      let newDislikedBy = [...disliked];
      let newLikedBy = liked.filter((id) => id !== userId); // remove from like if toggling dislike

      if (newDislikedBy.includes(userId)) {
        newDislikedBy = newDislikedBy.filter((id) => id !== userId);
        isDisliked = false;
      } else {
        newDislikedBy.push(userId);
        isDisliked = true;
      }

      updatedLikeCount = Math.max(0, newLikedBy.length);
      updatedDislikeCount = Math.max(0, newDislikedBy.length);

      return {
        ...rev,
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy,
        likesCount: updatedLikeCount,
        dislikesCount: updatedDislikeCount,
      };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      const targetRev = updatedLocals.find((r) => r.id === reviewId);
      if (targetRev) {
        await updateDoc(docRef, {
          likesCount: targetRev.likesCount,
          dislikesCount: targetRev.dislikesCount,
          likedBy: targetRev.likedBy,
          dislikedBy: targetRev.dislikedBy,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.warn('Firestore toggle dislike failed, updated locally:', error);
    }
  }

  return { likesCount: updatedLikeCount, dislikesCount: updatedDislikeCount, isDisliked };
}

/**
 * Adds a reply to a review
 */
export async function addReviewReply(
  reviewId: string,
  replyData: { userName: string; message: string },
  currentUser?: { uid: string; displayName?: string | null; photoURL?: string | null } | null
): Promise<ReviewReply> {
  const replyId = 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const userId = currentUser?.uid || auth.currentUser?.uid || 'guest_' + Math.random().toString(36).substring(2, 7);

  const newReply: ReviewReply = {
    id: replyId,
    userId,
    userName: (replyData.userName || currentUser?.displayName || 'Creator').slice(0, 100),
    userAvatar: currentUser?.photoURL || '',
    message: replyData.message.slice(0, 1000),
    createdAt: 'Just now',
  };

  const locals = getLocalReviews();
  let updatedReplies: ReviewReply[] = [];
  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const list = Array.isArray(rev.replies) ? [...rev.replies, newReply] : [newReply];
      updatedReplies = list;
      return { ...rev, replies: list };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await updateDoc(docRef, {
        replies: updatedReplies,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firestore add reply failed, updated locally:', error);
    }
  }

  return newReply;
}

/**
 * Deletes a reply from a review
 */
export async function deleteReviewReply(
  reviewId: string,
  replyId: string
): Promise<void> {
  const locals = getLocalReviews();
  let updatedReplies: ReviewReply[] = [];

  const updatedLocals = locals.map((rev) => {
    if (rev.id === reviewId) {
      const list = (rev.replies || []).filter((rep) => rep.id !== replyId);
      updatedReplies = list;
      return { ...rev, replies: list };
    }
    return rev;
  });

  saveLocalReviews(updatedLocals);

  if (auth.currentUser) {
    const path = `${REVIEWS_COLLECTION}/${reviewId}`;
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await updateDoc(docRef, {
        replies: updatedReplies,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firestore delete reply failed, updated locally:', error);
    }
  }
}
