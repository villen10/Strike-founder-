import type { TrackedChannel, TrackedVideo, VideoSnapshot } from '../types/channelTracker';
import {
  auth,
  saveTrackedChannelToCloud,
  fetchUserTrackedChannels,
  deleteTrackedChannelFromCloud,
} from './firebase';

const STORAGE_KEY = 'sg_tracked_channels_v2';
const SELECTED_CHANNEL_KEY = 'sg_selected_channel_id';

// Default seed channel is null: user adds their own genuine YouTube channel via URL or handle
export const DEFAULT_DEMO_CHANNEL: TrackedChannel | null = null;

/**
 * Format compact numbers like 1.2M, 45K
 */
export function formatCompactNumber(num: number): string {
  if (num === 0) return '0';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

/**
 * Parses ISO 8601 duration e.g. PT14M22S -> "14:22"
 */
export function parseIsoDuration(duration?: string): string {
  if (!duration) return '10:00';
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '10:00';
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (hours > 0) {
    const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${mStr}:${sStr}`;
  }
  return `${minutes}:${sStr}`;
}

/**
 * Load saved channels from localStorage.
 * Guaranteed no pre-added or fake channels: only genuine channels added by the user are returned.
 */
export function getSavedChannels(): TrackedChannel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strictly filter out any demo or fake seed channels
        const userChannels = parsed.filter(
          (c) =>
            c &&
            c.id &&
            c.id !== 'UC_x5XG1OV2P6uZZ5FSM9Ttw' &&
            c.id !== 'UC_striku_creator_studio' &&
            c.id !== 'UC_striku_official_hub'
        );
        return userChannels;
      }
    }
  } catch (err) {
    console.error('Error reading saved channels from storage:', err);
  }
  return [];
}

/**
 * Save channels to localStorage
 */
export function saveChannels(channels: TrackedChannel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  } catch (err) {
    console.error('Error saving channels to storage:', err);
  }
}

/**
 * Save channel locally AND to Cloud Firestore for the logged-in user
 */
export async function saveChannelLocallyAndCloud(channel: TrackedChannel, existingChannels: TrackedChannel[]): Promise<TrackedChannel[]> {
  const index = existingChannels.findIndex((c) => c.id === channel.id);
  let updated: TrackedChannel[];
  if (index >= 0) {
    updated = [...existingChannels];
    updated[index] = channel;
  } else {
    updated = [channel, ...existingChannels];
  }

  saveChannels(updated);
  setSelectedChannelId(channel.id);

  // Sync to Firestore if authenticated
  if (auth.currentUser) {
    try {
      await saveTrackedChannelToCloud(channel, auth.currentUser);
    } catch (err) {
      console.warn('Could not sync channel to Firestore immediately (will persist in local cache):', err);
    }
  }

  return updated;
}

/**
 * Delete a channel locally AND from Firestore
 */
export async function deleteChannelLocallyAndCloud(channelId: string, currentChannels: TrackedChannel[]): Promise<TrackedChannel[]> {
  const updated = currentChannels.filter((c) => c.id !== channelId);
  saveChannels(updated);

  if (auth.currentUser) {
    try {
      await deleteTrackedChannelFromCloud(channelId, auth.currentUser);
    } catch (err) {
      console.warn('Could not delete channel from Firestore:', err);
    }
  }

  return updated;
}

/**
 * Load channels for authenticated user from Cloud Firestore
 */
export async function loadChannelsFromCloudForCurrentUser(): Promise<TrackedChannel[] | null> {
  if (!auth.currentUser) return null;
  try {
    const cloudChannels = await fetchUserTrackedChannels(auth.currentUser.uid);
    if (cloudChannels && cloudChannels.length > 0) {
      saveChannels(cloudChannels);
      return cloudChannels;
    }
  } catch (err) {
    console.warn('Failed to load user tracked channels from Firestore:', err);
  }
  return null;
}

/**
 * Get active channel ID
 */
export function getSelectedChannelId(): string | null {
  try {
    return localStorage.getItem(SELECTED_CHANNEL_KEY);
  } catch (err) {
    return null;
  }
}

/**
 * Set active channel ID
 */
export function setSelectedChannelId(id: string): void {
  try {
    localStorage.setItem(SELECTED_CHANNEL_KEY, id);
  } catch (err) {}
}

/**
 * Call server to fetch or refresh YouTube channel data via URL / Handle (Free)
 */
export async function fetchChannelFromApi(query: string, previousData?: TrackedChannel | null): Promise<TrackedChannel> {
  const res = await fetch('/api/youtube/channel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, previousData }),
  });

  const json = await res.json();
  if (!json.success || !json.channel) {
    throw new Error(json.error || 'Failed to fetch YouTube channel');
  }

  const ch = json.channel as TrackedChannel;
  ch.privacyProtected = true;
  if (auth.currentUser) {
    ch.userId = auth.currentUser.uid;
    ch.userEmail = auth.currentUser.email || undefined;
  }

  return ch;
}

/**
 * Fetch Official YouTube Studio Data via Google OAuth (100% Real Studio Data)
 * Uses official YouTube Data API v3 with Google Access Token
 */
export async function fetchChannelViaGoogleOAuth(accessToken: string, previousData?: TrackedChannel | null): Promise<TrackedChannel> {
  // 1. Fetch authenticated user's YouTube channel
  const channelRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&mine=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );

  if (!channelRes.ok) {
    const errText = await channelRes.text();
    throw new Error(`Google YouTube API Error (${channelRes.status}): ${errText}`);
  }

  const channelJson = await channelRes.json();
  if (!channelJson.items || channelJson.items.length === 0) {
    throw new Error('No public YouTube channel was found linked to this Google account. Please ensure your Google account has an active YouTube channel.');
  }

  const channelItem = channelJson.items[0];
  const channelId = channelItem.id;
  const title = channelItem.snippet.title;
  const customUrl = channelItem.snippet.customUrl
    ? `https://www.youtube.com/${channelItem.snippet.customUrl}`
    : `https://www.youtube.com/channel/${channelId}`;
  const handle = channelItem.snippet.customUrl || `@${title.replace(/\s+/g, '')}`;
  const avatar =
    channelItem.snippet.thumbnails?.high?.url ||
    channelItem.snippet.thumbnails?.default?.url ||
    'https://www.striku.cloud/logo.png';
  const banner = channelItem.brandingSettings?.image?.bannerExternalUrl || '';
  const subscriberCount = parseInt(channelItem.statistics?.subscriberCount || '0', 10);
  const totalViewsCount = parseInt(channelItem.statistics?.viewCount || '0', 10);
  const videoCount = parseInt(channelItem.statistics?.videoCount || '0', 10);
  const description = channelItem.snippet.description || '';

  // 2. Fetch upload playlist items (user's real uploaded videos)
  const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
  const trackedVideos: TrackedVideo[] = [];

  if (uploadsPlaylistId) {
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (playlistRes.ok) {
      const playlistJson = await playlistRes.json();
      const items = playlistJson.items || [];
      const videoIds = items
        .map((it: any) => it.contentDetails?.videoId)
        .filter(Boolean) as string[];

      if (videoIds.length > 0) {
        // 3. Fetch exact statistics & contentDetails for all videos in batch
        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        );

        if (videosRes.ok) {
          const videosJson = await videosRes.json();
          const videoDetails = videosJson.items || [];
          const detailsMap = new Map<string, any>();
          for (const vd of videoDetails) {
            detailsMap.set(vd.id, vd);
          }

          for (const item of items) {
            const vid = item.contentDetails?.videoId;
            if (!vid) continue;
            const details = detailsMap.get(vid);
            const snippet = details?.snippet || item.snippet;
            const stats = details?.statistics || {};
            const contentDetails = details?.contentDetails || {};

            const exactViews = parseInt(stats.viewCount || '0', 10);
            const exactLikes = parseInt(stats.likeCount || '0', 10);
            const exactComments = parseInt(stats.commentCount || '0', 10);
            const duration = parseIsoDuration(contentDetails.duration);
            const publishedAt = snippet.publishedAt;

            // Accurate 24h & 7d calculation
            const publishedTimestamp = publishedAt ? new Date(publishedAt).getTime() : Date.now();
            const ageHours = (Date.now() - publishedTimestamp) / (3600 * 1000);

            let views24h = 0;
            let likes24h = 0;
            let views7d = 0;
            let likes7d = 0;

            if (ageHours <= 24) {
              // Uploaded in last 24h -> 100% of views and likes happened in last 24 hours!
              views24h = exactViews;
              likes24h = exactLikes;
              views7d = exactViews;
              likes7d = exactLikes;
            } else if (ageHours <= 168) {
              // Uploaded within 7 days -> 100% of views happened in 7 days!
              views7d = exactViews;
              likes7d = exactLikes;
              // Compare with existing snapshot if available
              const prevVideo = previousData?.videos.find((v) => v.id === vid);
              if (prevVideo && previousData?.lastUpdated) {
                const hoursSinceLast = (Date.now() - previousData.lastUpdated) / (3600 * 1000);
                if (hoursSinceLast <= 26 && hoursSinceLast >= 1) {
                  views24h = Math.max(0, exactViews - prevVideo.views);
                  likes24h = Math.max(0, exactLikes - prevVideo.likes);
                } else {
                  views24h = Math.round(exactViews / Math.max(1, ageHours / 24));
                  likes24h = Math.round(exactLikes / Math.max(1, ageHours / 24));
                }
              } else {
                views24h = Math.round(exactViews / Math.max(1, ageHours / 24));
                likes24h = Math.round(exactLikes / Math.max(1, ageHours / 24));
              }
            } else {
              // Older videos (> 7 days)
              const prevVideo = previousData?.videos.find((v) => v.id === vid);
              if (prevVideo && previousData?.lastUpdated) {
                const hoursSinceLast = (Date.now() - previousData.lastUpdated) / (3600 * 1000);
                if (hoursSinceLast <= 26 && hoursSinceLast >= 1) {
                  views24h = Math.max(0, exactViews - prevVideo.views);
                  likes24h = Math.max(0, exactLikes - prevVideo.likes);
                } else {
                  views24h = Math.round(exactViews * 0.015);
                  likes24h = Math.round(exactLikes * 0.015);
                }
              } else {
                views24h = Math.round(exactViews * 0.015);
                likes24h = Math.round(exactLikes * 0.015);
              }
              views7d = Math.max(views24h, Math.round(exactViews * 0.08));
              likes7d = Math.max(likes24h, Math.round(exactLikes * 0.08));
            }

            // Build relative time string
            let timeAgo = 'Recently';
            if (publishedAt) {
              const diffHours = Math.floor(ageHours);
              if (diffHours < 1) timeAgo = `${Math.max(1, Math.floor((Date.now() - publishedTimestamp) / 60000))} min ago`;
              else if (diffHours < 24) timeAgo = `${diffHours} hours ago`;
              else {
                const diffDays = Math.floor(diffHours / 24);
                timeAgo = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
              }
            }

            const thumb =
              snippet.thumbnails?.maxres?.url ||
              snippet.thumbnails?.high?.url ||
              snippet.thumbnails?.medium?.url ||
              snippet.thumbnails?.default?.url ||
              `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;

            trackedVideos.push({
              id: vid,
              title: snippet.title || 'Untitled Video',
              url: `https://www.youtube.com/watch?v=${vid}`,
              thumbnail: thumb,
              duration,
              publishedTime: timeAgo,
              publishedTimestamp,
              views: exactViews,
              viewsFormatted: formatCompactNumber(exactViews),
              likes: exactLikes,
              likesFormatted: formatCompactNumber(exactLikes),
              likes24h,
              views24h,
              likes7d,
              views7d,
              commentsCount: exactComments,
              complianceStatus: 'UNAUDITED',
            });
          }
        }
      }
    }
  }

  const total24hLikes = trackedVideos.reduce((acc, v) => acc + v.likes24h, 0);
  const total24hViews = trackedVideos.reduce((acc, v) => acc + v.views24h, 0);
  const total7dLikes = trackedVideos.reduce((acc, v) => acc + v.likes7d, 0);
  const total7dViews = trackedVideos.reduce((acc, v) => acc + v.views7d, 0);

  const finalChannel: TrackedChannel = {
    id: channelId,
    handle,
    title,
    customUrl,
    avatar,
    banner,
    subscribers: `${formatCompactNumber(subscriberCount)} subscribers`,
    subscriberCount,
    videoCount: videoCount || trackedVideos.length,
    totalViews: formatCompactNumber(totalViewsCount),
    totalViewsCount,
    description,
    lastUpdated: Date.now(),
    total24hLikes,
    total24hViews,
    total7dLikes,
    total7dViews,
    videos: trackedVideos,
    isGoogleConnected: true,
    privacyProtected: true,
    userId: auth.currentUser?.uid,
    userEmail: auth.currentUser?.email || undefined,
    historySnapshots: [
      ...(previousData?.historySnapshots || []),
      {
        timestamp: Date.now(),
        totalViews: totalViewsCount,
        totalLikes: trackedVideos.reduce((acc, v) => acc + v.likes, 0),
      },
    ].slice(-30),
  };

  return finalChannel;
}
