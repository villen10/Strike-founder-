import type { TrackedChannel, TrackedVideo } from '../types/channelTracker';

const STORAGE_KEY = 'sg_tracked_channels_v1';
const SELECTED_CHANNEL_KEY = 'sg_selected_channel_id';

// Default seed channel for instant preview if user hasn't added one yet
export const DEFAULT_DEMO_CHANNEL: TrackedChannel = {
  id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
  handle: '@GoogleDevelopers',
  title: 'Google for Developers',
  customUrl: 'https://www.youtube.com/@GoogleDevelopers',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
  banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=300&fit=crop',
  subscribers: '2.45M subscribers',
  subscriberCount: 2450000,
  videoCount: 28,
  totalViews: '38.4M',
  totalViewsCount: 38400000,
  description: 'Official channel for Google developer tools, tutorials, and ecosystem updates.',
  lastUpdated: Date.now() - 3600000,
  total24hLikes: 14280,
  total24hViews: 284500,
  total7dLikes: 68900,
  total7dViews: 1420000,
  videos: [
    {
      id: 'demo-vid-1',
      title: 'Gemini 2.5 Flash: Real-time Multimodal Vision & Speed Walkthrough',
      url: 'https://www.youtube.com/watch?v=71ya_JC_IbM',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop',
      duration: '14:22',
      publishedTime: '18 hours ago',
      views: 145000,
      viewsFormatted: '145K',
      likes: 8200,
      likesFormatted: '8.2K',
      likes24h: 7600,
      views24h: 135000,
      likes7d: 8200,
      views7d: 145000,
      complianceStatus: 'SAFE_TO_UPLOAD',
      strikeRiskPct: 0,
    },
    {
      id: 'demo-vid-2',
      title: 'Building Next-Gen Web Applications with React 19 & TypeScript',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
      duration: '22:40',
      publishedTime: '3 days ago',
      views: 312000,
      viewsFormatted: '312K',
      likes: 15400,
      likesFormatted: '15.4K',
      likes24h: 3200,
      views24h: 68000,
      likes7d: 14100,
      views7d: 290000,
      complianceStatus: 'SAFE_TO_UPLOAD',
      strikeRiskPct: 2,
    },
    {
      id: 'demo-vid-3',
      title: 'Firebase Studio & Cloud Database Architecture in 2026',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&h=360&fit=crop',
      duration: '09:15',
      publishedTime: '5 days ago',
      views: 94000,
      viewsFormatted: '94K',
      likes: 4950,
      likesFormatted: '4.9K',
      likes24h: 1480,
      views24h: 29000,
      likes7d: 4600,
      views7d: 89000,
      complianceStatus: 'SAFE_TO_UPLOAD',
      strikeRiskPct: 0,
    },
    {
      id: 'demo-vid-4',
      title: 'YouTube Policy & Safe Harbor Guide for Creators (Copyright & Minor Safety)',
      url: 'https://www.youtube.com/watch?v=k1BneeJTDcU',
      thumbnail: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=640&h=360&fit=crop',
      duration: '18:50',
      publishedTime: '6 days ago',
      views: 78000,
      viewsFormatted: '78K',
      likes: 4100,
      likesFormatted: '4.1K',
      likes24h: 920,
      views24h: 18500,
      likes7d: 3800,
      views7d: 74000,
      complianceStatus: 'SAFE_TO_UPLOAD',
      strikeRiskPct: 0,
    },
    {
      id: 'demo-vid-5',
      title: 'Creator Economy 2026: Monetization, Super Thanks & Shorts RPM',
      url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop',
      duration: '11:10',
      publishedTime: '2 weeks ago',
      views: 220000,
      viewsFormatted: '220K',
      likes: 11200,
      likesFormatted: '11.2K',
      likes24h: 780,
      views24h: 16000,
      likes7d: 2800,
      views7d: 58000,
      complianceStatus: 'SAFE_TO_UPLOAD',
      strikeRiskPct: 0,
    },
  ],
};

/**
 * Load saved channels from localStorage
 */
export function getSavedChannels(): TrackedChannel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading saved channels from storage:', err);
  }
  return [DEFAULT_DEMO_CHANNEL];
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
 * Call server to fetch or refresh YouTube channel data (100% Free)
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

  return json.channel;
}
