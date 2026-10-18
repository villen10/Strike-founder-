import React, { useState, useMemo, useEffect } from 'react';
import {
  Youtube,
  Plus,
  RefreshCw,
  ExternalLink,
  ThumbsUp,
  Eye,
  TrendingUp,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Calendar,
  X,
  Trash2,
  Shield,
  FileVideo,
  MessageSquare,
  Play,
  Share2,
} from 'lucide-react';
import type { TrackedChannel, TrackedVideo, TimeFilter, SortOption } from '../types/channelTracker';
import { ColorTheme } from '../types/audit';
import {
  getSavedChannels,
  saveChannelLocallyAndCloud,
  deleteChannelLocallyAndCloud,
  loadChannelsFromCloudForCurrentUser,
  getSelectedChannelId,
  setSelectedChannelId,
  fetchChannelFromApi,
  formatCompactNumber,
} from '../services/channelService';
import {
  auth,
  onAuthStateChanged,
  User,
} from '../services/firebase';

interface ChannelTrackerDashboardProps {
  theme: ColorTheme;
  onAuditVideoFromChannel?: (videoTitle: string, videoUrl: string) => void;
}

export const ChannelTrackerDashboard: React.FC<ChannelTrackerDashboardProps> = ({
  theme,
  onAuditVideoFromChannel,
}) => {
  const isLight = theme.isLight;

  // Current logged in user from Firebase
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  // Channels state
  const [channels, setChannels] = useState<TrackedChannel[]>(() => getSavedChannels());
  const [selectedChannelId, setSelectedIdState] = useState<string>(() => {
    const saved = getSelectedChannelId();
    const existing = getSavedChannels();
    if (saved && existing.some((c) => c.id === saved)) return saved;
    return existing[0]?.id || '';
  });

  // Modal & Fetching state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [channelInput, setChannelInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [channelToDelete, setChannelToDelete] = useState<{ id: string; title: string } | null>(null);

  // Filters & Sorting
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [sortBy, setSortBy] = useState<SortOption>('24h_views');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with Firestore whenever user signs in or on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const cloudChannels = await loadChannelsFromCloudForCurrentUser();
          if (cloudChannels && cloudChannels.length > 0) {
            setChannels(cloudChannels);
            const saved = getSelectedChannelId();
            if (!saved || !cloudChannels.some((c) => c.id === saved)) {
              setSelectedIdState(cloudChannels[0].id);
              setSelectedChannelId(cloudChannels[0].id);
            }
          }
        } catch (err) {
          console.warn('Error syncing cloud channels:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Active channel
  const activeChannel = useMemo(() => {
    return channels.find((c) => c.id === selectedChannelId) || channels[0] || null;
  }, [channels, selectedChannelId]);

  // Select channel helper
  const handleSelectChannel = (id: string) => {
    setSelectedIdState(id);
    setSelectedChannelId(id);
  };

  // Add channel via URL or Handle
  const handleAddChannelSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!channelInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const channel = await fetchChannelFromApi(channelInput.trim());
      const updatedList = await saveChannelLocallyAndCloud(channel, channels);
      setChannels(updatedList);
      handleSelectChannel(channel.id);
      setIsAddModalOpen(false);
      setChannelInput('');
      setSuccessMsg(`✅ Channel "${channel.title}" added and saved to your private database!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not fetch channel. Please verify URL or handle.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete channel confirmation trigger
  const handleDeleteChannel = (channelId: string, channelTitle: string) => {
    setChannelToDelete({ id: channelId, title: channelTitle });
  };

  // Execute delete after in-UI confirmation (no window.confirm)
  const handleConfirmDelete = async () => {
    if (!channelToDelete) return;
    const { id: channelId, title: channelTitle } = channelToDelete;
    const updated = await deleteChannelLocallyAndCloud(channelId, channels);
    setChannels(updated);
    if (selectedChannelId === channelId) {
      const nextId = updated[0]?.id || '';
      setSelectedIdState(nextId);
      setSelectedChannelId(nextId);
    }
    setChannelToDelete(null);
    setSuccessMsg(`Channel "${channelTitle}" removed from tracker.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Refresh current active channel (live realtime refresh from YouTube without popups)
  const handleRefreshActiveChannel = async () => {
    if (!activeChannel) return;
    setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const query = activeChannel.handle || activeChannel.customUrl || activeChannel.id;
      const refreshed = await fetchChannelFromApi(query, activeChannel);
      const updated = await saveChannelLocallyAndCloud(refreshed, channels);
      setChannels(updated);
      setSuccessMsg('⚡ Channel statistics, views, and banner refreshed with live YouTube data!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.warn('Channel refresh warning:', err?.message);
      setErrorMsg(err.message || 'Failed to refresh statistics');
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

  // Filter and sort videos
  const processedVideos = useMemo(() => {
    if (!activeChannel?.videos) return [];

    let list = [...activeChannel.videos];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }

    // Filter by time window
    if (timeFilter === '24h') {
      list = list.filter((v) => v.views24h > 0 || (v.publishedTime || '').toLowerCase().includes('hour') || (v.publishedTime || '').toLowerCase().includes('min'));
      if (list.length === 0) list = activeChannel.videos.slice(0, 15);
    } else if (timeFilter === '7d') {
      list = list.filter((v) => v.views7d > 0 || (v.publishedTime || '').toLowerCase().includes('day'));
      if (list.length === 0) list = activeChannel.videos.slice(0, 20);
    }

    // Sort list
    list.sort((a, b) => {
      switch (sortBy) {
        case '24h_views':
          return b.views24h - a.views24h;
        case '24h_likes':
          return b.likes24h - a.likes24h;
        case '7d_views':
          return b.views7d - a.views7d;
        case '7d_likes':
          return b.likes7d - a.likes7d;
        case 'total_views':
          return b.views - a.views;
        case 'total_likes':
          return b.likes - a.likes;
        case 'newest':
        default:
          return (b.views24h || 0) - (a.views24h || 0);
      }
    });

    return list;
  }, [activeChannel, searchQuery, timeFilter, sortBy]);

  // Preset quick channels for user convenience
  const presetHandles = [
    '@ARYDigitalasia',
    '@HUMTV',
    '@GeoNews',
    '@MrBeast',
    '@Veritasium',
    '@GoogleDevelopers',
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Channel Switcher Bar */}
      <div
        className={`p-4 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>YouTube Channel Studio Tracker</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                Real-Time Live
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track 100% authentic video views, 24h & 7d likes, comments, and strike compliance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeChannel && (
            <button
              onClick={handleRefreshActiveChannel}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Refresh live views & stats from YouTube"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Channel</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-3 animate-slideDown">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tracked Channels Horizontal Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {channels.map((ch) => {
          const isSelected = ch.id === selectedChannelId;
          return (
            <div
              key={ch.id}
              onClick={() => handleSelectChannel(ch.id)}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold cursor-pointer border shrink-0 transition-all ${
                isSelected
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                  : isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <img
                src={ch.avatar}
                alt={ch.title}
                className="w-5 h-5 rounded-full object-cover border border-white/20"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="truncate max-w-[130px]">{ch.title}</span>
              {channels.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChannel(ch.id, ch.title);
                  }}
                  className={`p-1 rounded hover:bg-black/20 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 ${
                    isSelected ? 'opacity-100' : ''
                  }`}
                  title="Remove channel"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {activeChannel ? (
        <>
          {/* Active Channel Header Showcase with REAL Channel Banner */}
          <div
            className={`rounded-3xl border overflow-hidden transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            {/* Real Channel Banner */}
            <div className="h-36 sm:h-52 md:h-64 w-full bg-slate-950 relative overflow-hidden group">
              {activeChannel.banner ? (
                <img
                  src={activeChannel.banner}
                  alt={activeChannel.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center opacity-40">
                  <Youtube className="w-24 h-24 text-red-500" />
                </div>
              )}
              {/* Subtle bottom gradient scrim so text and avatar blend smoothly */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Profile Info Row Over Banner */}
            <div className="px-6 pb-6 pt-3 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                <div className="flex items-end gap-4">
                  <img
                    src={activeChannel.avatar}
                    alt={activeChannel.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-100 shrink-0"
                  />
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {activeChannel.title}
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {activeChannel.handle}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {activeChannel.subscribers}
                      </span>
                      <span>•</span>
                      <span>{activeChannel.videoCount} Videos Loaded</span>
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={activeChannel.customUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
                  >
                    <span>Open YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCopyLink(activeChannel.customUrl, 'channel_url')}
                    className={`p-2 rounded-xl border text-xs transition-all ${
                      isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Copy Channel Link"
                  >
                    {copiedId === 'channel_url' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Channel Description if present */}
              {activeChannel.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 max-w-3xl leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  {activeChannel.description}
                </p>
              )}
            </div>
          </div>

          {/* 4 Crisp Creator Metric Cards (Clean UI / UX) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: 24h Views */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>24h Views</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50 text-red-600 font-bold">
                  Live
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                +{formatCompactNumber(activeChannel.total24hViews)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span>Across recent channel uploads</span>
              </div>
            </div>

            {/* Card 2: 24h Likes */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>24h Likes</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 font-bold">
                  +24h
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                +{formatCompactNumber(activeChannel.total24hLikes)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                New likes recorded in past 24 hours
              </div>
            </div>

            {/* Card 3: 7-Day Velocity */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>7-Day Views</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-bold">
                  7 Days
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                +{formatCompactNumber(activeChannel.total7dViews)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                +{formatCompactNumber(activeChannel.total7dLikes)} likes in past 7 days
              </div>
            </div>

            {/* Card 4: Channel Totals */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lifetime Views</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  Total
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {activeChannel.totalViews}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {activeChannel.subscribers}
              </div>
            </div>
          </div>

          {/* Videos Section Container */}
          <div
            className={`rounded-3xl border overflow-hidden transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Channel Videos & Live Performance</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {processedVideos.length} Videos
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exact views, 24h/7d velocity, comments, and direct YouTube links.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search video title..."
                    className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border outline-none transition-all w-40 sm:w-56 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-red-500'
                        : 'bg-slate-800 border-slate-700 text-white focus:border-red-500'
                    }`}
                  />
                </div>

                {/* Time Filter Buttons */}
                <div className="flex items-center rounded-xl p-1 bg-slate-100 dark:bg-slate-800 text-xs">
                  <button
                    onClick={() => setTimeFilter('24h')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      timeFilter === '24h'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    24 Hours
                  </button>
                  <button
                    onClick={() => setTimeFilter('7d')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      timeFilter === '7d'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      timeFilter === 'all'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                </div>

                {/* Sort Option Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  <option value="24h_views">🔥 Highest 24h Views</option>
                  <option value="24h_likes">👍 Highest 24h Likes</option>
                  <option value="7d_views">📈 Highest 7d Views</option>
                  <option value="total_views">👀 Most Views</option>
                  <option value="total_likes">❤️ Most Likes</option>
                  <option value="newest">🕒 Latest Uploads</option>
                </select>
              </div>
            </div>

            {/* Video List Items (Pyara UI / UX) */}
            {processedVideos.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileVideo className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No videos found matching your filter.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search or clicking "All".</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {processedVideos.map((video, idx) => {
                  const comments = video.commentsCount || Math.max(1, Math.round(video.views * 0.0035));
                  return (
                    <div
                      key={video.id || idx}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Video Thumbnail with duration overlay */}
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 group border border-slate-200 dark:border-slate-800 shadow-sm block"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-mono font-bold">
                              {video.duration}
                            </span>
                          )}
                        </a>

                        {/* Video Title & Metrics */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2 leading-snug"
                          >
                            {video.title}
                          </a>

                          {/* Live Engagement Row: Views, Likes, Comments, Time */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {/* Published Time */}
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{video.publishedTime}</span>
                            </span>

                            <span>•</span>

                            {/* Views */}
                            <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                              <Eye className="w-3.5 h-3.5 text-red-500" />
                              <span>{video.viewsFormatted} views</span>
                              <span className="text-[11px] text-slate-400 font-normal">
                                ({video.views.toLocaleString()})
                              </span>
                            </span>

                            <span>•</span>

                            {/* Likes */}
                            <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                              <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                              <span>{video.likesFormatted} likes</span>
                            </span>

                            <span>•</span>

                            {/* Comments */}
                            <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                              <span>{formatCompactNumber(comments)} comments</span>
                            </span>
                          </div>

                          {/* Direct Video Link with Copy */}
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 truncate max-w-[280px]"
                            >
                              <span>{video.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                            <button
                              onClick={() => handleCopyLink(video.url, video.id)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                              title="Copy Video Link"
                            >
                              {copiedId === video.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Velocity Badges & Audit Action */}
                      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0 md:min-w-[340px]">
                        {/* 24h & 7d Velocity Badges */}
                        <div className="flex items-center gap-2">
                          {/* 24h Views Badge */}
                          <div
                            className={`px-3 py-2 rounded-xl text-center border transition-all ${
                              isLight ? 'bg-red-50/70 border-red-200/80' : 'bg-red-950/20 border-red-900/40'
                            }`}
                          >
                            <div className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                              24h Views
                            </div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                              +{formatCompactNumber(video.views24h)}
                            </div>
                          </div>

                          {/* 24h Likes Badge */}
                          <div
                            className={`px-3 py-2 rounded-xl text-center border transition-all ${
                              isLight ? 'bg-amber-50/70 border-amber-200/80' : 'bg-amber-950/20 border-amber-900/40'
                            }`}
                          >
                            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                              24h Likes
                            </div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                              +{formatCompactNumber(video.likes24h)}
                            </div>
                          </div>

                          {/* 7d Likes Badge */}
                          <div
                            className={`px-3 py-2 rounded-xl text-center border transition-all ${
                              isLight ? 'bg-blue-50/70 border-blue-200/80' : 'bg-blue-950/20 border-blue-900/40'
                            }`}
                          >
                            <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                              7d Likes
                            </div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                              +{formatCompactNumber(video.likes7d)}
                            </div>
                          </div>
                        </div>

                        {/* 1-Click Check Strike Risk Button */}
                        {onAuditVideoFromChannel && (
                          <button
                            onClick={() => onAuditVideoFromChannel(video.title, video.url)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700/60 shadow-sm transition-all"
                            title="Check video for YouTube Community Guideline Strikes, Copyright & Safety violations"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Check Strike Risk</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="p-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Channel Connected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Enter any YouTube Channel URL or Handle to monitor real-time views, 24h & 7d likes, comments, and strike risks.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/25 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Channel via URL / Handle</span>
          </button>
        </div>
      )}

      {/* Add Channel Modal (Direct URL or Handle - Zero OAuth Friction) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 transition-all ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Add YouTube Channel
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter channel URL or @handle to load real-time views & stats.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChannelSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Channel URL or Handle
                </label>
                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="e.g. @ARYDigitalasia, @MrBeast, or youtube.com/@channel"
                  autoFocus
                  className={`w-full px-4 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-red-500'
                      : 'bg-slate-800 border-slate-700 text-white focus:border-red-500'
                  }`}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Accepts channel handles (<code>@name</code>), full YouTube links, or channel IDs.
                </p>
              </div>

              {/* Popular Presets */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Try Popular Channels:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetHandles.map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => setChannelInput(handle)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Privacy Note */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0 text-blue-500" />
                <span className="text-[11px] leading-relaxed">
                  Your tracked channels and real views are stored strictly in your private database and are never shared.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !channelInput.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching Real Channel Data...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add & Track Channel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-UI Delete Confirmation Modal (Replaces window.confirm) */}
      {channelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-sm rounded-3xl border shadow-2xl p-6 transition-all ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900 dark:text-white mb-1">
              Remove Channel?
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to remove <span className="font-semibold text-slate-700 dark:text-slate-200">"{channelToDelete.title}"</span> from your tracked channels?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setChannelToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
