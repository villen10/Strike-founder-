import React from 'react';
import { Youtube, Flame, ThumbsUp, TrendingUp, Eye, Search, Play } from 'lucide-react';

interface SkeletonProps {
  isLight?: boolean;
}

/**
 * Shimmer element with smooth animated gradient
 */
const ShimmerBlock: React.FC<{
  className?: string;
  isLight?: boolean;
}> = ({ className = '', isLight = false }) => (
  <div
    className={`animate-pulse relative overflow-hidden rounded-xl ${
      isLight ? 'bg-slate-200/80' : 'bg-slate-800/80'
    } ${className}`}
  >
    <div
      className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent ${
        isLight ? 'via-white/40' : 'via-slate-700/30'
      } to-transparent`}
    />
  </div>
);

/**
 * Skeleton loader for the horizontal channel selector bar
 */
export const ChannelPillsSkeleton: React.FC<SkeletonProps> = ({ isLight = false }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar animate-fadeIn">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border shrink-0 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <ShimmerBlock isLight={isLight} className="w-5 h-5 rounded-full" />
          <ShimmerBlock isLight={isLight} className="w-24 h-3.5 rounded-md" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for the Active Channel Banner and Profile Header
 */
export const ChannelHeaderSkeleton: React.FC<SkeletonProps> = ({ isLight = false }) => {
  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-all animate-fadeIn ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}
    >
      {/* Real-size Banner Skeleton */}
      <div
        className={`h-36 sm:h-52 md:h-64 w-full relative overflow-hidden ${
          isLight ? 'bg-slate-200' : 'bg-slate-950'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center opacity-20">
          <Youtube className={`w-20 sm:w-24 h-20 sm:h-24 ${isLight ? 'text-slate-400' : 'text-slate-700'}`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Profile Info Row Over Banner */}
      <div className="px-6 pb-6 pt-3 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          <div className="flex items-end gap-4">
            {/* Avatar Skeleton */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 ${
                isLight ? 'border-white bg-slate-300' : 'border-slate-900 bg-slate-800'
              } shadow-2xl shrink-0 animate-pulse relative overflow-hidden`}
            >
              <div
                className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent ${
                  isLight ? 'via-white/40' : 'via-slate-700/30'
                } to-transparent`}
              />
            </div>

            <div className="pb-1 space-y-2 flex-1">
              {/* Channel Title */}
              <ShimmerBlock isLight={isLight} className="h-6 sm:h-7 w-44 sm:w-60 rounded-xl" />
              {/* Handle, Subs & Video count */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <ShimmerBlock isLight={isLight} className="h-5 w-20 rounded-lg" />
                <ShimmerBlock isLight={isLight} className="h-5 w-24 rounded-lg" />
                <ShimmerBlock isLight={isLight} className="h-5 w-28 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-2">
            <ShimmerBlock isLight={isLight} className="h-9 w-28 rounded-xl" />
            <ShimmerBlock isLight={isLight} className="h-9 w-9 rounded-xl" />
          </div>
        </div>

        {/* Channel Description Skeleton */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <ShimmerBlock isLight={isLight} className="h-3.5 w-full sm:w-3/4 rounded-md" />
          <ShimmerBlock isLight={isLight} className="h-3.5 w-4/5 sm:w-1/2 rounded-md" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for the 4 Creator Metric Cards
 */
export const MetricCardsSkeleton: React.FC<SkeletonProps> = ({ isLight = false }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 animate-fadeIn">
      {/* 24h Views */}
      <div
        className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-red-500/60 font-bold text-[11px] uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>24h Views</span>
          </span>
          <ShimmerBlock isLight={isLight} className="h-4 w-10 rounded-md" />
        </div>
        <ShimmerBlock isLight={isLight} className="h-8 w-28 rounded-xl mb-2" />
        <ShimmerBlock isLight={isLight} className="h-3 w-36 rounded-md" />
      </div>

      {/* 24h Likes */}
      <div
        className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-amber-500/60 font-bold text-[11px] uppercase tracking-wider">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>24h Likes</span>
          </span>
          <ShimmerBlock isLight={isLight} className="h-4 w-10 rounded-md" />
        </div>
        <ShimmerBlock isLight={isLight} className="h-8 w-24 rounded-xl mb-2" />
        <ShimmerBlock isLight={isLight} className="h-3 w-40 rounded-md" />
      </div>

      {/* 7-Day Velocity */}
      <div
        className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-blue-500/60 font-bold text-[11px] uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>7-Day Views</span>
          </span>
          <ShimmerBlock isLight={isLight} className="h-4 w-12 rounded-md" />
        </div>
        <ShimmerBlock isLight={isLight} className="h-8 w-32 rounded-xl mb-2" />
        <ShimmerBlock isLight={isLight} className="h-3 w-36 rounded-md" />
      </div>

      {/* Lifetime Views */}
      <div
        className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>Lifetime Views</span>
          </span>
          <ShimmerBlock isLight={isLight} className="h-4 w-10 rounded-md" />
        </div>
        <ShimmerBlock isLight={isLight} className="h-8 w-28 rounded-xl mb-2" />
        <ShimmerBlock isLight={isLight} className="h-3 w-28 rounded-md" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for video list cards
 */
export const VideoListSkeleton: React.FC<SkeletonProps & { count?: number }> = ({
  isLight = false,
  count = 4,
}) => {
  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-all animate-fadeIn ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}
    >
      {/* Filter and Search Bar Skeleton */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ShimmerBlock isLight={isLight} className="h-5 w-52 rounded-lg" />
            <ShimmerBlock isLight={isLight} className="h-4 w-16 rounded-full" />
          </div>
          <ShimmerBlock isLight={isLight} className="h-3.5 w-64 rounded-md" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar placeholder */}
          <ShimmerBlock isLight={isLight} className="h-8 w-40 sm:w-52 rounded-xl" />
          {/* Time filter pills */}
          <ShimmerBlock isLight={isLight} className="h-8 w-44 rounded-xl" />
          {/* Sort dropdown */}
          <ShimmerBlock isLight={isLight} className="h-8 w-36 rounded-xl" />
        </div>
      </div>

      {/* Video Row Items Skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Thumbnail & Details */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* 16:9 Thumbnail Skeleton */}
              <div
                className={`relative w-36 sm:w-44 aspect-video rounded-xl shrink-0 overflow-hidden ${
                  isLight ? 'bg-slate-200' : 'bg-slate-800'
                } border ${isLight ? 'border-slate-200' : 'border-slate-700/80'}`}
              >
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <Play className={`w-6 h-6 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
                </div>
                {/* Duration badge placeholder */}
                <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/60 w-10 h-3.5" />
              </div>

              {/* Title & Metadata Skeletons */}
              <div className="flex-1 min-w-0 space-y-2">
                <ShimmerBlock isLight={isLight} className="h-4.5 w-4/5 rounded-lg" />
                <ShimmerBlock isLight={isLight} className="h-4.5 w-3/5 rounded-lg" />

                {/* Engagement row placeholders */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                  <ShimmerBlock isLight={isLight} className="h-3.5 w-20 rounded-md" />
                  <ShimmerBlock isLight={isLight} className="h-3.5 w-24 rounded-md" />
                  <ShimmerBlock isLight={isLight} className="h-3.5 w-20 rounded-md" />
                  <ShimmerBlock isLight={isLight} className="h-3.5 w-24 rounded-md" />
                </div>

                {/* Video URL skeleton */}
                <ShimmerBlock isLight={isLight} className="h-3 w-48 rounded-md pt-1" />
              </div>
            </div>

            {/* Right: Velocity Badges & Audit Action */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0 md:min-w-[340px]">
              <div className="flex items-center gap-2">
                <ShimmerBlock isLight={isLight} className="h-12 w-20 rounded-xl" />
                <ShimmerBlock isLight={isLight} className="h-12 w-20 rounded-xl" />
                <ShimmerBlock isLight={isLight} className="h-12 w-20 rounded-xl" />
              </div>
              <ShimmerBlock isLight={isLight} className="h-9 w-36 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Full Composite Channel Tracker Skeleton Loader
 */
export const ChannelTrackerSkeleton: React.FC<SkeletonProps & { statusText?: string }> = ({
  isLight = false,
  statusText = 'Connecting to YouTube API to fetch channel analytics...',
}) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Live Sync Status Banner */}
      <div
        className={`px-4 py-3 rounded-2xl border flex items-center justify-between gap-3 ${
          isLight
            ? 'bg-red-50/70 border-red-200 text-red-700'
            : 'bg-red-950/30 border-red-900/50 text-red-300'
        }`}
      >
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span>{statusText}</span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-75 hidden sm:inline">
          YouTube Data API v3
        </span>
      </div>

      {/* Channel Pills Skeleton */}
      <ChannelPillsSkeleton isLight={isLight} />

      {/* Active Channel Showcase Skeleton */}
      <ChannelHeaderSkeleton isLight={isLight} />

      {/* 4 Metric Cards Skeleton */}
      <MetricCardsSkeleton isLight={isLight} />

      {/* Video List Skeleton */}
      <VideoListSkeleton isLight={isLight} count={4} />
    </div>
  );
};

/**
 * Mini Channel Preview Skeleton for Modals
 */
export const ChannelModalSkeleton: React.FC<SkeletonProps> = ({ isLight = false }) => {
  return (
    <div
      className={`p-4 rounded-2xl border space-y-3 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <ShimmerBlock isLight={isLight} className="w-12 h-12 rounded-2xl" />
        <div className="space-y-1.5 flex-1">
          <ShimmerBlock isLight={isLight} className="h-4 w-40 rounded-md" />
          <ShimmerBlock isLight={isLight} className="h-3 w-28 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
        <ShimmerBlock isLight={isLight} className="h-10 rounded-xl" />
        <ShimmerBlock isLight={isLight} className="h-10 rounded-xl" />
        <ShimmerBlock isLight={isLight} className="h-10 rounded-xl" />
      </div>
      <div className="text-[11px] text-center text-slate-400 font-mono flex items-center justify-center gap-1.5 pt-1">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span>Querying live YouTube channels, uploads, and views...</span>
      </div>
    </div>
  );
};
