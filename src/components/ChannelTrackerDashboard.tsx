import React, { useState, useMemo } from 'react';
import {
  Youtube,
  Plus,
  RefreshCw,
  ExternalLink,
  ThumbsUp,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Flame,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  BarChart3,
  X,
  Share2,
} from 'lucide-react';
import type { TrackedChannel, TrackedVideo, TimeFilter, SortOption } from '../types/channelTracker';
import { ColorTheme } from '../types/audit';
import {
  getSavedChannels,
  saveChannels,
  getSelectedChannelId,
  setSelectedChannelId,
  fetchChannelFromApi,
} from '../services/channelService';

interface ChannelTrackerDashboardProps {
  theme: ColorTheme;
  onAuditVideoFromChannel?: (videoTitle: string, videoUrl: string) => void;
}

export const ChannelTrackerDashboard: React.FC<ChannelTrackerDashboardProps> = ({
  theme,
  onAuditVideoFromChannel,
}) => {
  const isLight = theme.isLight;

  // Channels state
  const [channels, setChannels] = useState<TrackedChannel[]>(() => getSavedChannels());
  const [selectedChannelId, setSelectedIdState] = useState<string>(() => {
    const saved = getSelectedChannelId();
    const existing = getSavedChannels();
    if (saved && existing.some((c) => c.id === saved)) return saved;
    return existing[0]?.id || '';
  });

  // Active channel
  const activeChannel = useMemo(() => {
    return channels.find((c) => c.id === selectedChannelId) || channels[0] || null;
  }, [channels, selectedChannelId]);

  // Modal & Fetching state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [channelInput, setChannelInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters & Sorting
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [sortBy, setSortBy] = useState<SortOption>('24h_likes');
  const [searchQuery, setSearchQuery] = useState('');

  // Select channel helper
  const handleSelectChannel = (id: string) => {
    setSelectedIdState(id);
    setSelectedChannelId(id);
  };

  // Add new channel
  const handleAddChannelSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!channelInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const channel = await fetchChannelFromApi(channelInput.trim());
      // Check if already in list
      const existingIdx = channels.findIndex((c) => c.id === channel.id || c.handle.toLowerCase() === channel.handle.toLowerCase());
      let updated: TrackedChannel[];
      if (existingIdx >= 0) {
        updated = [...channels];
        updated[existingIdx] = channel;
      } else {
        updated = [channel, ...channels];
      }

      setChannels(updated);
      saveChannels(updated);
      handleSelectChannel(channel.id);
      setIsAddModalOpen(false);
      setChannelInput('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not fetch channel. Please verify URL or handle.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh current active channel
  const handleRefreshActiveChannel = async () => {
    if (!activeChannel) return;
    setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const refreshed = await fetchChannelFromApi(activeChannel.handle || activeChannel.customUrl, activeChannel);
      const updated = channels.map((c) => (c.id === activeChannel.id ? refreshed : c));
      setChannels(updated);
      saveChannels(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to refresh stats');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Copy link helper
  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered & Sorted videos
  const processedVideos = useMemo(() => {
    if (!activeChannel) return [];
    let list = [...activeChannel.videos];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case '24h_likes':
          return b.likes24h - a.likes24h;
        case '24h_views':
          return b.views24h - a.views24h;
        case '7d_likes':
          return b.likes7d - a.likes7d;
        case 'total_views':
          return b.views - a.views;
        case 'total_likes':
          return b.likes - a.likes;
        case 'newest':
        default:
          return 0; // keeps original chronological order from channel feed
      }
    });

    return list;
  }, [activeChannel, searchQuery, sortBy]);

  // Quick preset handles
  const presetHandles = ['@MrBeast', '@mkbhd', '@Veritasium', '@PewDiePie', '@GoogleDevelopers'];

  return (
    <div className="space-y-6 pb-12 font-['Public_Sans',sans-serif]">
      {/* Top Banner / Breadcrumb */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-r from-red-50 via-white to-amber-50/40 border-red-200/70 shadow-sm'
            : 'bg-gradient-to-r from-red-950/30 via-slate-900 to-amber-950/20 border-red-900/40 shadow-lg'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white tracking-wide uppercase">
                <Youtube className="w-3.5 h-3.5" /> 100% Free API Live
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                }`}
              >
                ✓ No Google Login Required
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-['Satoshi',sans-serif]">
              YouTube Channel & Real-Time Stats Tracker
            </h1>
            <p className={`text-sm ${theme.textMutedClass}`}>
              Apna channel add karein aur 24 ghante aur 7 din ke views, total likes, video links aur viral velocity track karein.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRefreshActiveChannel}
              disabled={isRefreshing || !activeChannel}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100'
              } disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
              {isRefreshing ? 'Refreshing Live Data...' : 'Refresh Live Stats'}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Channel
            </button>
          </div>
        </div>

        {/* Channel Switcher Tabs */}
        {channels.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className={`text-xs font-medium shrink-0 ${theme.textMutedClass}`}>Channels ({channels.length}):</span>
            {channels.map((ch) => {
              const isSelected = ch.id === activeChannel?.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChannel(ch.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                    isSelected
                      ? isLight
                        ? 'bg-red-600 text-white border-red-600 shadow-sm font-semibold'
                        : 'bg-red-600 text-white border-red-500 font-semibold shadow-red-900/40 shadow-sm'
                      : isLight
                      ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-200'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <img src={ch.avatar} alt={ch.title} className="w-4 h-4 rounded-full object-cover" />
                  <span className="truncate max-w-[120px]">{ch.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-red-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {ch.videos.length} vids
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-red-200 dark:hover:bg-red-900 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Channel Spotlight & Analytics Banner */}
      {activeChannel ? (
        <div className="space-y-6">
          {/* Channel Header Profile Card */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Avatar + Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={activeChannel.avatar}
                    alt={activeChannel.title}
                    className="w-16 h-16 md:w-20 md:md:h-20 rounded-2xl object-cover ring-2 ring-red-500/30 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full shadow">
                    <Youtube className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-bold font-['Satoshi',sans-serif] tracking-tight text-slate-900 dark:text-white">
                      {activeChannel.title}
                    </h2>
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                      {activeChannel.handle}
                    </span>
                  </div>
                  <p className={`text-xs ${theme.textMutedClass} max-w-xl line-clamp-1`}>
                    {activeChannel.description || 'Verified YouTube Creator Channel'}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeChannel.subscribers}
                    </span>
                    <span className={theme.textMutedClass}>•</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {activeChannel.videos.length} videos tracked
                    </span>
                    <span className={theme.textMutedClass}>•</span>
                    <a
                      href={activeChannel.customUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      Visit Channel <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick 24h & 7d Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 24h Likes */}
                <div
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isLight
                      ? 'bg-rose-50/70 border-rose-200/80'
                      : 'bg-rose-950/20 border-rose-900/40'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> 24H Likes
                  </div>
                  <div className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white font-['Satoshi',sans-serif]">
                    +{activeChannel.total24hLikes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Fast velocity
                  </div>
                </div>

                {/* 24h Views */}
                <div
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isLight
                      ? 'bg-blue-50/70 border-blue-200/80'
                      : 'bg-blue-950/20 border-blue-900/40'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
                    <Eye className="w-3.5 h-3.5" /> 24H Views
                  </div>
                  <div className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white font-['Satoshi',sans-serif]">
                    +{activeChannel.total24hViews.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    Today's Audience
                  </div>
                </div>

                {/* 7d Likes */}
                <div
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isLight
                      ? 'bg-amber-50/70 border-amber-200/80'
                      : 'bg-amber-950/20 border-amber-900/40'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-1">
                    <Flame className="w-3.5 h-3.5" /> 7-Day Likes
                  </div>
                  <div className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white font-['Satoshi',sans-serif]">
                    +{activeChannel.total7dLikes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                    Weekly Total
                  </div>
                </div>

                {/* 7d Views */}
                <div
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isLight
                      ? 'bg-emerald-50/70 border-emerald-200/80'
                      : 'bg-emerald-950/20 border-emerald-900/40'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
                    <BarChart3 className="w-3.5 h-3.5" /> 7-Day Views
                  </div>
                  <div className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white font-['Satoshi',sans-serif]">
                    +{activeChannel.total7dViews.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                    7 Days Reach
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar: Time Filter, Sort & Search */}
          <div
            className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-sm'
            }`}
          >
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.textMutedClass}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search video titles or keywords..."
                className={`w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border focus:outline-hidden transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-red-500 focus:bg-white'
                    : 'bg-slate-800 border-slate-700 text-slate-100 focus:border-red-500 focus:bg-slate-900'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Time Filter & Sort Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Time Range Pills */}
              <div
                className={`inline-flex items-center p-1 rounded-xl border text-xs ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <button
                  onClick={() => {
                    setTimeFilter('24h');
                    setSortBy('24h_likes');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    timeFilter === '24h'
                      ? 'bg-red-600 text-white shadow-xs'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  24 Hours
                </button>
                <button
                  onClick={() => {
                    setTimeFilter('7d');
                    setSortBy('7d_likes');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    timeFilter === '7d'
                      ? 'bg-red-600 text-white shadow-xs'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => {
                    setTimeFilter('all');
                    setSortBy('total_views');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    timeFilter === 'all'
                      ? 'bg-red-600 text-white shadow-xs'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Time
                </button>
              </div>

              {/* Sort By Select */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`text-xs font-medium ${theme.textMutedClass}`}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={`py-1.5 px-3 rounded-xl border text-xs font-medium focus:outline-hidden ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <option value="24h_likes">Most Likes in 24h 🔥</option>
                  <option value="24h_views">Most Views in 24h 📈</option>
                  <option value="7d_likes">Most Likes in 7 Days</option>
                  <option value="total_views">Highest Total Views</option>
                  <option value="total_likes">Highest Total Likes</option>
                  <option value="newest">Latest Uploads</option>
                </select>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-['Satoshi',sans-serif] text-slate-900 dark:text-white flex items-center gap-2">
                <span>Channel Uploads & Performance</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                  {processedVideos.length} videos
                </span>
              </h3>
              <span className={`text-xs ${theme.textMutedClass}`}>
                Showing sorted by: <span className="font-semibold text-red-600">{sortBy.replace(/_/g, ' ')}</span>
              </span>
            </div>

            {processedVideos.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No videos found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedVideos.map((video) => {
                  const isCopied = copiedId === video.id;

                  return (
                    <div
                      key={video.id}
                      className={`group p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                        isLight
                          ? 'bg-white hover:bg-slate-50/60 border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-lg'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Thumbnail & Video Meta */}
                        <div className="flex gap-3.5">
                          {/* Thumbnail with overlay duration */}
                          <div className="relative shrink-0 w-32 sm:w-40 aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-xs">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            {video.duration && (
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/85 text-white shadow">
                                {video.duration}
                              </span>
                            )}
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                              title="Play on YouTube"
                            >
                              <div className="p-2 rounded-full bg-red-600 text-white shadow-lg">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </a>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs sm:text-sm font-bold font-['Satoshi',sans-serif] line-clamp-2 text-slate-900 dark:text-white hover:text-red-600 transition-colors leading-snug"
                              title={video.title}
                            >
                              {video.title}
                            </a>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {video.publishedTime}
                              </span>
                            </div>
                            <div className="pt-1 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                {video.viewsFormatted} total views
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 24h & 7d Stat Metric Blocks */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {/* 24h Box */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              isLight
                                ? 'bg-rose-50/60 border-rose-200/60'
                                : 'bg-rose-950/20 border-rose-900/30'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] text-rose-700 dark:text-rose-400 font-semibold mb-0.5">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" /> 24H Likes:
                              </span>
                              <span className="font-bold text-xs">+{video.likes24h.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
                              <span>24h Views:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">+{video.views24h.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* 7d Box */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              isLight
                                ? 'bg-amber-50/60 border-amber-200/60'
                                : 'bg-amber-950/20 border-amber-900/30'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-semibold mb-0.5">
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3" /> 7D Likes:
                              </span>
                              <span className="font-bold text-xs">+{video.likes7d.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
                              <span>7d Views:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">+{video.views7d.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Action Footer */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        {/* Direct Link button */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyLink(video.url, video.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                            title="Copy YouTube Video Link"
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Copied!' : 'Copy Link'}
                          </button>

                          <a
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`p-1.5 rounded-lg border transition-all ${
                              isLight
                                ? 'hover:bg-slate-100 text-slate-600 border-slate-200'
                                : 'hover:bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                            title="Open on YouTube"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* 1-Click Strike Audit Button */}
                        {onAuditVideoFromChannel && (
                          <button
                            onClick={() => onAuditVideoFromChannel(video.title, video.url)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs hover:scale-[1.02] active:scale-95"
                            title="Run automated safety and community strike audit on this video"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Audit Strike Risk
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty state: No channel added yet */
        <div
          className={`p-12 text-center rounded-2xl border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-md'
          }`}
        >
          <Youtube className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold font-['Satoshi',sans-serif] text-slate-900 dark:text-white mb-1">
            No YouTube Channel Connected Yet
          </h2>
          <p className={`text-xs max-w-md mx-auto mb-5 ${theme.textMutedClass}`}>
            Apna YouTube channel URL ya handle enter karein taake 24 ghante aur 7 din ke views, total likes aur links track ho sakein.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Add Your Channel Now
          </button>
        </div>
      )}

      {/* Add Channel Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Satoshi',sans-serif] text-slate-900 dark:text-white">
                    Add YouTube Channel
                  </h3>
                  <p className={`text-xs ${theme.textMutedClass}`}>100% Free • No Google login or password needed</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChannelSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter Channel URL or Handle (@Name)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    placeholder="e.g. https://youtube.com/@MrBeast or @mkbhd"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-hidden transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500 focus:bg-white'
                        : 'bg-slate-800 border-slate-700 text-white focus:border-red-500 focus:bg-slate-850'
                    }`}
                    autoFocus
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Aap pura link (youtube.com/@...) ya sirf apna handle (@handle) daal sakte hain.
                </p>
              </div>

              {/* Quick suggestions */}
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Or test with popular channels:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetHandles.map((handle) => (
                    <button
                      type="button"
                      key={handle}
                      onClick={() => setChannelInput(handle)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !channelInput.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-all shadow-md shadow-red-600/20"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching YouTube Channel...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Fetch & Add Channel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
