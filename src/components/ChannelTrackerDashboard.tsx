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
  Trash2,
  Lock,
  Shield,
  LogIn,
  CheckCircle,
  Radio,
  FileVideo,
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
  fetchChannelViaGoogleOAuth,
  formatCompactNumber,
} from '../services/channelService';
import {
  auth,
  signInWithGoogleYouTube,
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
  const [addMode, setAddMode] = useState<'google' | 'url'>('google');
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

  // Google Channel Login (OAuth YouTube Studio integration)
  const handleGoogleChannelLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { user, accessToken } = await signInWithGoogleYouTube();
      if (!accessToken) {
        throw new Error('Google Sign-in was successful, but no YouTube access token was returned. Please try again.');
      }

      const studioChannel = await fetchChannelViaGoogleOAuth(accessToken, activeChannel);
      const updatedList = await saveChannelLocallyAndCloud(studioChannel, channels);
      setChannels(updatedList);
      handleSelectChannel(studioChannel.id);
      setIsAddModalOpen(false);
      setSuccessMsg(`🎉 Successfully connected "${studioChannel.title}" via Google! Real YouTube Studio statistics and videos loaded.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        // User closed the popup window voluntarily
        setErrorMsg('Google sign-in popup close kar diya gaya tha. Agar channel link karna chahte hain to dobara try karein ya URL/Handle ke zariye channel add karein.');
        return;
      }
      if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Browser ne Google sign-in popup block kar diya. Popups allow karein ya URL/Handle ke zariye channel add karein.');
        return;
      }
      console.error('Google Channel Login Error:', err);
      setErrorMsg(err.message || 'Google authentication failed or access to YouTube was denied.');
    } finally {
      setIsLoading(false);
    }
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
      setSuccessMsg(`✅ Channel "${channel.title}" added and saved to your database!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not fetch channel. Please verify URL or handle.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete channel confirmation trigger (without window.confirm)
  const handleDeleteChannel = (channelId: string, channelTitle: string) => {
    setChannelToDelete({ id: channelId, title: channelTitle });
  };

  // Confirm and execute channel removal
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

  // Refresh current active channel (safe background refresh without disruptive popups)
  const handleRefreshActiveChannel = async () => {
    if (!activeChannel) return;
    setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const query = activeChannel.handle || activeChannel.customUrl || activeChannel.id;
      const refreshed = await fetchChannelFromApi(query, activeChannel);
      const updated = await saveChannelLocallyAndCloud(refreshed, channels);
      setChannels(updated);
      setSuccessMsg('⚡ Channel statistics and video views refreshed with latest YouTube data!');
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
        case '24h_views':
          return b.views24h - a.views24h;
        case '24h_likes':
          return b.likes24h - a.likes24h;
        case '7d_likes':
          return b.likes7d - a.likes7d;
        case 'total_views':
          return b.views - a.views;
        case 'total_likes':
          return b.likes - a.likes;
        case 'newest':
        default:
          return (b.publishedTimestamp || 0) - (a.publishedTimestamp || 0);
      }
    });

    return list;
  }, [activeChannel, searchQuery, sortBy]);

  // Quick preset handles
  const presetHandles = ['@ARYDigitalasia', '@YouTube', '@GoogleDevelopers', '@MrBeast'];

  return (
    <div className="space-y-6 pb-12 font-['Public_Sans',sans-serif]">
      {/* Privacy & Firestore Protection Banner */}
      <div
        className={`px-5 py-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
          isLight
            ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
            : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Data Privacy & Security
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 font-semibold text-emerald-800 dark:text-emerald-300">
                Isolated per User
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {currentUser?.email ? (
                <>
                  Channel metrics are saved securely to your private Firestore database (
                  <strong className="text-emerald-700 dark:text-emerald-300 font-mono">{currentUser.email}</strong>). Strictly isolated by Firestore Rules — never shared or exposed.
                </>
              ) : (
                <>
                  Channels are cached securely in your browser. Sign in with Google to synchronize privately to your cloud database.
                </>
              )}
            </p>
          </div>
        </div>

        {!currentUser && (
          <button
            onClick={handleGoogleChannelLogin}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In with Google to Sync
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar with Channel Switcher & Actions */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-r from-red-50 via-white to-amber-50/40 border-red-200/70 shadow-sm'
            : 'bg-gradient-to-r from-red-950/20 via-slate-900/40 to-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  YouTube Studio & Channel Analytics
                </h1>
                {activeChannel?.isGoogleConnected && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    <CheckCircle className="w-3 h-3" />
                    Google Studio Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time video views, 24-hour & 7-day velocity pulses, direct video links & 1-click strike audits.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Refresh Button */}
            <button
              onClick={handleRefreshActiveChannel}
              disabled={isRefreshing || !activeChannel}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
                isRefreshing
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/30'
              } ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-200'}`}
              title="Refresh latest views and likes from YouTube"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Stats'}</span>
            </button>

            {/* Google Channel Login Button (Primary) */}
            <button
              onClick={handleGoogleChannelLogin}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-500/25 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect via Google</span>
            </button>

            {/* Add Channel by URL / Handle */}
            <button
              onClick={() => {
                setAddMode('url');
                setIsAddModalOpen(true);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL / Handle</span>
            </button>
          </div>
        </div>

        {/* Channels Tab Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-500" />
            Your Channels:
          </span>
          {channels.map((ch) => {
            const isSelected = ch.id === selectedChannelId;
            return (
              <div
                key={ch.id}
                className={`group flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-500/30'
                      : 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
                onClick={() => handleSelectChannel(ch.id)}
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
                {ch.isGoogleConnected && (
                  <CheckCircle className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                )}
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
      </div>

      {activeChannel ? (
        <>
          {/* Active Channel Header Showcase */}
          <div
            className={`rounded-3xl border overflow-hidden transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            {/* Banner */}
            <div className="h-32 md:h-44 w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 relative overflow-hidden">
              {activeChannel.banner ? (
                <img
                  src={activeChannel.banner}
                  alt={activeChannel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full opacity-30 flex items-center justify-center">
                  <Youtube className="w-24 h-24 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Profile Info Row */}
            <div className="px-6 pb-6 pt-3 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
                <div className="flex items-end gap-4">
                  <img
                    src={activeChannel.avatar}
                    alt={activeChannel.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-slate-100"
                  />
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {activeChannel.title}
                      </h2>
                      {activeChannel.isGoogleConnected && (
                        <span className="p-1 rounded-full bg-blue-500 text-white shadow-sm" title="Google Studio Authenticated">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {activeChannel.handle}
                      </span>
                      <span>•</span>
                      <span>{activeChannel.subscribers}</span>
                      <span>•</span>
                      <span>{activeChannel.videoCount} Videos Loaded</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeChannel.customUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
                  >
                    <span>Open Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCopyLink(activeChannel.customUrl, 'channel_url')}
                    className={`p-2 rounded-xl border text-xs transition-all ${
                      isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                    title="Copy Channel Link"
                  >
                    {copiedId === 'channel_url' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Analytics Pulse Cards (24h & 7d) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: 24h Views */}
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${
                isLight
                  ? 'bg-gradient-to-br from-red-50/60 to-white border-red-200/80 shadow-sm'
                  : 'bg-gradient-to-br from-red-950/20 to-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
                <span>24-Hour Views</span>
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {activeChannel.total24hViews.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Real 24h gain across recent uploads</span>
              </div>
            </div>

            {/* Card 2: 24h Likes */}
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${
                isLight
                  ? 'bg-gradient-to-br from-amber-50/60 to-white border-amber-200/80 shadow-sm'
                  : 'bg-gradient-to-br from-amber-950/20 to-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                <span>24-Hour Likes</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <ThumbsUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {activeChannel.total24hLikes.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                <span>Audience engagement pulse</span>
              </div>
            </div>

            {/* Card 3: 7-Day Performance */}
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${
                isLight
                  ? 'bg-gradient-to-br from-blue-50/60 to-white border-blue-200/80 shadow-sm'
                  : 'bg-gradient-to-br from-blue-950/20 to-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <span>7-Day Views</span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {activeChannel.total7dViews.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{activeChannel.total7dLikes.toLocaleString()} likes in 7 days</span>
              </div>
            </div>

            {/* Card 4: Total Lifetime Views */}
            <div
              className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${
                isLight
                  ? 'bg-gradient-to-br from-purple-50/60 to-white border-purple-200/80 shadow-sm'
                  : 'bg-gradient-to-br from-purple-950/20 to-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                <span>Lifetime Channel Views</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {activeChannel.totalViews}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{activeChannel.subscribers}</span>
              </div>
            </div>
          </div>

          {/* Videos Table & Explorer Section */}
          <div
            className={`rounded-3xl border overflow-hidden transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
          >
            {/* Table Header & Controls */}
            <div className="p-6 border-b border-slate-200/70 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Tracked Video Catalog ({processedVideos.length})</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 font-semibold">
                    Live YouTube Data
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect authentic views, 24h & 7d likes, copy direct YouTube video links, or trigger a 1-click strike risk audit.
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos..."
                    className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border outline-none transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-red-500'
                        : 'bg-slate-800 border-slate-700 text-white focus:border-red-500'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Sort Option */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <option value="24h_views">🔥 Top 24h Views</option>
                  <option value="24h_likes">👍 Top 24h Likes</option>
                  <option value="7d_likes">📈 Top 7d Likes</option>
                  <option value="total_views">👀 Most Views</option>
                  <option value="total_likes">❤️ Most Likes</option>
                  <option value="newest">🕒 Latest Uploads</option>
                </select>
              </div>
            </div>

            {/* Video List Items */}
            {processedVideos.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileVideo className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No videos found matching your query.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search filter or syncing channel stats.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {processedVideos.map((video, idx) => (
                  <div
                    key={video.id || idx}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Video Thumbnail with duration */}
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 group border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                        {video.duration && (
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold">
                            {video.duration}
                          </span>
                        )}
                      </a>

                      {/* Video Details */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2 leading-snug"
                        >
                          {video.title}
                        </a>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {video.publishedTime}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {video.viewsFormatted} views ({video.views.toLocaleString()} total)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                            <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                            {video.likesFormatted} likes
                          </span>
                        </div>

                        {/* Direct Video Link */}
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

                    {/* Right: Metrics & Audit Action */}
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

                      {/* 1-Click Strike Audit Risk Button */}
                      {onAuditVideoFromChannel && (
                        <button
                          onClick={() => onAuditVideoFromChannel(video.title, video.url)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                          title="Audit video for Community Guideline Strikes, Minor Safety & Demonetization"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Audit Strike Risk</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Channel Connected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Connect your YouTube channel using Google Login or track via Channel URL/Handle to monitor real-time views, 24h & 7d likes, and analyze strike risks.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleGoogleChannelLogin}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Connect with Google
            </button>
            <button
              onClick={() => {
                setAddMode('url');
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add via URL / Handle
            </button>
          </div>
        </div>
      )}

      {/* Add Channel Modal */}
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
                    Choose how you want to connect and track channel data.
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

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setAddMode('google')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  addMode === 'google'
                    ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Login (Studio)</span>
              </button>
              <button
                type="button"
                onClick={() => setAddMode('url')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  addMode === 'url'
                    ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>URL or Handle</span>
              </button>
            </div>

            {addMode === 'google' ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    1-Click YouTube Studio Authorization
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                    Connect directly to the YouTube API. Grants read-only access to fetch exact video views, 24h & 7d likes, and real studio analytics.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2 text-left">
                  <Shield className="w-4 h-4 shrink-0 text-blue-500" />
                  <span>
                    Your channel data is stored in your private Firestore document and is never shared with anyone.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleChannelLogin}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting YouTube Studio...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Continue with Google Account</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddChannelSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Channel URL or Handle
                  </label>
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    placeholder="e.g. @ARYDigitalasia or youtube.com/@MrBeast"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-red-500'
                        : 'bg-slate-800 border-slate-700 text-white focus:border-red-500'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts handles (<code>@username</code>), full YouTube URLs, or channel IDs.
                  </p>
                </div>

                {/* Presets */}
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
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Fetching Channel...</span>
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
            )}
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
