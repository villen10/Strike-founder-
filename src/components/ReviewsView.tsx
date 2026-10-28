import React, { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Trash2,
  Edit3,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  AlertCircle,
  X,
  Share2,
} from 'lucide-react';
import {
  ReviewItem,
  ReviewReply,
  subscribeToReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewLike,
  toggleReviewDislike,
  addReviewReply,
  deleteReviewReply,
} from '../services/reviewService';
import { isUserSuperAdmin } from '../services/adminService';

interface ReviewsViewProps {
  isLight: boolean;
  currentUser?: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  } | null;
  onSignIn?: () => void;
  initialMode?: 'all' | 'my-reviews';
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  isLight,
  currentUser,
  onSignIn,
  initialMode = 'all',
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'my-reviews'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');

  // New Review Form State
  const [authorName, setAuthorName] = useState(currentUser?.displayName || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Active Reply Box per review
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState(currentUser?.displayName || '');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Sync authorName when currentUser updates
  useEffect(() => {
    if (currentUser?.displayName && !authorName) {
      setAuthorName(currentUser.displayName);
    }
  }, [currentUser]);

  // Subscribe to real-time reviews
  useEffect(() => {
    const unsubscribe = subscribeToReviews((updatedReviews) => {
      setReviews(updatedReviews);
    });
    return () => unsubscribe();
  }, []);

  // Update tab if initialMode prop changes
  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // Get current user identifier for like/dislike & my-reviews
  const currentUserId = currentUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('striku_guest_uid') || 'guest_user') : 'guest_user');
  if (typeof window !== 'undefined' && !localStorage.getItem('striku_guest_uid')) {
    localStorage.setItem('striku_guest_uid', 'guest_' + Math.random().toString(36).substring(2, 9));
  }

  // Calculate Rating Statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : 'New';

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // Filter reviews
  const displayedReviews = reviews.filter((r) => {
    if (activeTab === 'my-reviews') {
      const isMyReview = r.userId === currentUserId || (currentUser?.email && r.userEmail === currentUser.email);
      const hasMyReply = (r.replies || []).some((rep) => rep.userId === currentUserId);
      if (!isMyReview && !hasMyReply) return false;
    }
    if (selectedStarFilter !== 'all' && r.rating !== selectedStarFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.userName.toLowerCase().includes(q);
      const matchComment = r.comment.toLowerCase().includes(q);
      const matchReply = (r.replies || []).some((rep) => rep.message.toLowerCase().includes(q) || rep.userName.toLowerCase().includes(q));
      if (!matchName && !matchComment && !matchReply) return false;
    }
    return true;
  });

  const myReviewsCount = reviews.filter(
    (r) => r.userId === currentUserId || (currentUser?.email && r.userEmail === currentUser.email)
  ).length;

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nameToUse = authorName.trim() || currentUser?.displayName || 'YouTube Creator';
    if (!comment.trim()) {
      setFormError('Please enter your review description.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(
        {
          userName: nameToUse,
          rating,
          comment: comment.trim(),
          userEmail: currentUser?.email || undefined,
          userAvatar: currentUser?.photoURL || undefined,
        },
        currentUser
      );

      setComment('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setFormError('Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (review: ReviewItem) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    if (!editComment.trim()) return;

    setIsUpdating(true);
    try {
      await updateReview(
        editingReview.id,
        {
          rating: editRating,
          comment: editComment.trim(),
        },
        currentUser
      );
      setEditingReview(null);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(reviewId);
    }
  };

  const handleLike = async (reviewId: string) => {
    await toggleReviewLike(reviewId, currentUserId);
  };

  const handleDislike = async (reviewId: string) => {
    await toggleReviewDislike(reviewId, currentUserId);
  };

  const handleSendReply = async (reviewId: string) => {
    if (!replyMessage.trim()) return;
    setIsSendingReply(true);
    const isAdmin = isUserSuperAdmin(currentUser?.email);
    try {
      await addReviewReply(
        reviewId,
        {
          userName: replyName.trim() || (isAdmin ? 'Striku Official Support' : currentUser?.displayName || 'Creator'),
          message: replyMessage.trim(),
          userEmail: currentUser?.email || undefined,
        },
        currentUser
      );
      setReplyMessage('');
      setReplyingReviewId(null);
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    if (window.confirm('Delete your reply?')) {
      await deleteReviewReply(reviewId, replyId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 font-public-sans flex flex-col gap-8">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>Community Feedback &amp; Ratings</span>
          </div>
          <h1 className={`font-satoshi text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            Creator Reviews &amp; Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
            Real feedback from YouTubers, video editors, and studios who protect their channels with Striku. Share your experience or explore peer reviews.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>All Reviews ({totalReviews})</span>
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my-reviews'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>My Reviews ({myReviewsCount})</span>
          </button>
        </div>
      </div>

      {/* Rating Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div
          className={`p-6 rounded-3xl border flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800 shadow-md'
          }`}
        >
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Satisfaction
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className={`font-satoshi text-4xl sm:text-5xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {avgRating}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">out of 5.0 stars</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            {totalReviews > 0
              ? `Based on ${totalReviews} authentic creator submission${totalReviews > 1 ? 's' : ''}. Ratings update in real-time.`
              : 'No reviews submitted yet. Use the form below to be the first creator to share your experience!'}
          </p>
        </div>

        {/* Rating Breakdown Bar Chart */}
        <div
          className={`p-6 rounded-3xl border md:col-span-2 flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Rating Distribution
            </span>
            <span className="text-xs text-slate-400 font-mono">100% Verified Community</span>
          </div>

          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <button
                  key={stars}
                  onClick={() => setSelectedStarFilter(selectedStarFilter === stars ? 'all' : stars)}
                  className="flex items-center gap-3 text-xs group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-1 w-14 shrink-0 font-bold text-slate-600 dark:text-slate-400">
                    <span>{stars}</span>
                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-[11px] text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Form on Left/Top + Reviews Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Post a Review Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div
            className={`rounded-3xl border p-6 sticky top-20 ${
              isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                <Edit3 className="h-4 w-4" />
              </div>
              <h3 className={`font-satoshi text-base font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Write a Review
              </h3>
            </div>

            {submitSuccess && (
              <div className="mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Thank you! Your review has been posted successfully.</span>
              </div>
            )}

            {formError && (
              <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateReview} className="flex flex-col gap-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rating:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-lg hover:scale-110 transition cursor-pointer"
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`h-6 w-6 transition ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-xs text-amber-500 font-bold ml-2">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Creator Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Name / Channel:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ali Khan (Gaming Zone)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={100}
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs font-sans transition outline-none ${
                    isLight
                      ? 'border-slate-200 bg-slate-50 text-slate-900 focus:border-red-500 focus:bg-white'
                      : 'border-slate-800 bg-slate-950 text-slate-100 focus:border-red-500'
                  }`}
                />
              </div>

              {/* Review Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Review &amp; Experience:
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {comment.length} / 2000
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Share how Striku helped you detect strikes, copyright audio claims, or safe-cut timecodes..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                  className={`w-full rounded-xl border p-3 text-xs font-sans transition outline-none resize-none ${
                    isLight
                      ? 'border-slate-200 bg-slate-50 text-slate-900 focus:border-red-500 focus:bg-white'
                      : 'border-slate-800 bg-slate-950 text-slate-100 focus:border-red-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sans text-xs font-bold py-2.5 shadow-lg shadow-red-900/30 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Posting Review...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Review</span>
                  </>
                )}
              </button>

              {!currentUser && onSignIn && (
                <p className="text-[11px] text-slate-400 text-center mt-1">
                  Signed in with Google?{' '}
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="text-red-500 underline hover:text-red-400 cursor-pointer"
                  >
                    Login here
                  </button>{' '}
                  for verified creator status.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Search & Star Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews by keyword, name, or comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl border pl-9 pr-3.5 py-2 text-xs font-sans transition outline-none ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900 focus:border-red-500 shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-100 focus:border-red-500 shadow-sm'
                }`}
              />
            </div>

            {selectedStarFilter !== 'all' && (
              <button
                onClick={() => setSelectedStarFilter('all')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>Filter: {selectedStarFilter} Stars</span>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Active Mode Notice for "My Reviews" */}
          {activeTab === 'my-reviews' && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isLight ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <User className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  Viewing your submitted reviews and replies. You have full permission to <strong>Edit</strong> or <strong>Delete</strong> your feedback anytime.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('all')}
                className="text-xs font-bold underline hover:opacity-80 shrink-0 cursor-pointer ml-3"
              >
                View All Reviews
              </button>
            </div>
          )}

          {/* Reviews Stream */}
          <div className="flex flex-col gap-4">
            {displayedReviews.map((rev) => {
              const isOwner = rev.userId === currentUserId || (currentUser?.email && rev.userEmail === currentUser.email);
              const isLiked = (rev.likedBy || []).includes(currentUserId);
              const isDisliked = (rev.dislikedBy || []).includes(currentUserId);
              const repliesCount = (rev.replies || []).length;
              const isReplyBoxOpen = replyingReviewId === rev.id;

              return (
                <div
                  key={rev.id}
                  className={`rounded-3xl border p-5 sm:p-6 transition flex flex-col gap-4 ${
                    isLight
                      ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  {/* Top Review Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar || 'https://www.striku.cloud/logo.png'}
                        alt={rev.userName}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://www.striku.cloud/logo.png';
                        }}
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-satoshi text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                            {rev.userName}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            <span>Verified Creator</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span>{rev.createdAt}</span>
                          {rev.isEdited && <span>· Edited</span>}
                        </div>
                      </div>
                    </div>

                    {/* Star Badge */}
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-500 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  {/* Review Body */}
                  <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                    {rev.comment}
                  </p>

                  {/* Review Actions: Like, Dislike, Reply, Edit, Delete */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(rev.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isLiked
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400'
                            : isLight
                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                            : 'border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400'
                        }`}
                        title="Like this review"
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{rev.likesCount || 0}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={() => handleDislike(rev.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isDisliked
                            ? 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400'
                            : isLight
                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                            : 'border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400'
                        }`}
                        title="Dislike this review"
                      >
                        <ThumbsDown className={`h-3.5 w-3.5 ${isDisliked ? 'fill-current' : ''}`} />
                        <span>{rev.dislikesCount || 0}</span>
                      </button>

                      {/* Reply Button */}
                      <button
                        onClick={() => {
                          const willOpen = !isReplyBoxOpen;
                          setReplyingReviewId(willOpen ? rev.id : null);
                          if (willOpen && isUserSuperAdmin(currentUser?.email)) {
                            setReplyName('Striku Official Support');
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isReplyBoxOpen
                            ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                            : isLight
                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                            : 'border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400'
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{repliesCount > 0 ? `${repliesCount} Replies` : 'Reply'}</span>
                      </button>
                    </div>

                    {/* Owner Actions: Edit & Delete */}
                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(rev)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition cursor-pointer"
                          title="Edit review"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Reply Box */}
                  {isReplyBoxOpen && (
                    <div className="mt-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                          Leave a Reply:
                        </span>
                        {isUserSuperAdmin(currentUser?.email) && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-bold shadow-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Replying as Verified Striku Admin</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Your name..."
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          className={`sm:w-1/3 rounded-xl border px-3 py-1.5 text-xs font-sans outline-none ${
                            isLight
                              ? 'border-slate-200 bg-white text-slate-900 focus:border-red-500'
                              : 'border-slate-800 bg-slate-900 text-slate-100 focus:border-red-500'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder={isUserSuperAdmin(currentUser?.email) ? 'Type official support response...' : 'Type your message...'}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className={`flex-1 rounded-xl border px-3 py-1.5 text-xs font-sans outline-none ${
                            isLight
                              ? 'border-slate-200 bg-white text-slate-900 focus:border-red-500'
                              : 'border-slate-800 bg-slate-900 text-slate-100 focus:border-red-500'
                          }`}
                        />
                        <button
                          onClick={() => handleSendReply(rev.id)}
                          disabled={isSendingReply || !replyMessage.trim()}
                          className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <Send className="h-3 w-3" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Threaded Replies List */}
                  {repliesCount > 0 && (
                    <div className="mt-1 flex flex-col gap-2.5 pl-3 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                      {rev.replies.map((reply) => {
                        const isMyReply = reply.userId === currentUserId;
                        const isOfficialReply = Boolean(
                          reply.isOfficial ||
                          isUserSuperAdmin(reply.userEmail) ||
                          (reply.userName && (reply.userName.toLowerCase().includes('striku official') || reply.userName.toLowerCase().includes('striku compliance') || reply.userName.toLowerCase().includes('striku legal') || reply.userName.toLowerCase().includes('striku team'))) ||
                          reply.userId === 'admin-striku'
                        );

                        return (
                          <div
                            key={reply.id}
                            className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-1.5 transition-all ${
                              isOfficialReply
                                ? isLight
                                  ? 'bg-rose-50/70 border-rose-300/80 shadow-xs ring-1 ring-rose-500/10'
                                  : 'bg-rose-950/20 border-rose-800/60 shadow-xs ring-1 ring-rose-500/20'
                                : isLight
                                ? 'bg-slate-50/80 border-slate-200'
                                : 'bg-slate-950/60 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 font-bold flex-wrap">
                                <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                {isOfficialReply ? (
                                  <img
                                    src="https://www.striku.cloud/logo.png"
                                    alt="Striku Official"
                                    className="h-5 w-5 rounded-full object-cover border border-rose-500/30 shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : reply.userAvatar ? (
                                  <img
                                    src={reply.userAvatar}
                                    alt={reply.userName}
                                    className="h-5 w-5 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = 'https://www.striku.cloud/logo.png';
                                    }}
                                  />
                                ) : null}
                                <span className={isOfficialReply ? 'text-rose-600 dark:text-rose-400 font-extrabold' : isLight ? 'text-slate-900' : 'text-slate-100'}>
                                  {reply.userName}
                                </span>
                                {isOfficialReply && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold px-2 py-0.5 text-[9px] shadow-xs tracking-wider uppercase">
                                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                    <span>Verified Official Reply</span>
                                  </span>
                                )}
                                <span className="font-mono text-[10px] text-slate-400 font-normal">
                                  · {reply.createdAt}
                                </span>
                              </div>
                              {isMyReply && (
                                <button
                                  onClick={() => handleDeleteReply(rev.id, reply.id)}
                                  className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                                  title="Delete reply"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            <p className={`pl-5 leading-relaxed ${isOfficialReply ? (isLight ? 'text-slate-800 font-medium' : 'text-slate-200 font-medium') : 'text-slate-600 dark:text-slate-300'}`}>
                              {reply.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {displayedReviews.length === 0 && (
              <div className="text-center py-16 border rounded-3xl border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center gap-3">
                <MessageSquare className="h-10 w-10 text-slate-400" />
                <h4 className="font-satoshi text-base font-bold text-slate-700 dark:text-slate-300">
                  {activeTab === 'my-reviews'
                    ? 'You have not submitted any reviews yet.'
                    : 'No matching reviews found.'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {activeTab === 'my-reviews'
                    ? 'Use the form on the left to write your first review and share your feedback with creators worldwide!'
                    : 'Be the first to share your thoughts by posting a review above.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 flex flex-col gap-4 shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-satoshi text-lg font-bold">Edit Your Review</h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Edit Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Rating:</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= editRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-mono text-xs text-amber-500 font-bold ml-2">
                  {editRating} / 5
                </span>
              </div>
            </div>

            {/* Edit Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Review Description:</label>
              <textarea
                rows={5}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                maxLength={2000}
                className={`w-full rounded-xl border p-3 text-xs font-sans outline-none resize-none ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-900 focus:border-red-500'
                    : 'border-slate-800 bg-slate-950 text-slate-100 focus:border-red-500'
                }`}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating || !editComment.trim()}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
