export interface VideoSnapshot {
  timestamp: number;
  views: number;
  likes: number;
}

export interface TrackedVideo {
  id: string; // YouTube Video ID
  title: string;
  url: string; // Direct YouTube link e.g. https://www.youtube.com/watch?v=...
  thumbnail: string;
  duration?: string; // e.g. "12:45"
  publishedTime: string; // e.g. "2 days ago"
  publishedTimestamp?: number;
  views: number;
  viewsFormatted: string;
  likes: number;
  likesFormatted: string;
  likes24h: number; // Likes gained in last 24 hours
  views24h: number; // Views gained in last 24 hours
  likes7d: number; // Likes gained in last 7 days
  views7d: number; // Views gained in last 7 days
  commentsCount?: number;
  complianceStatus?: 'SAFE_TO_UPLOAD' | 'MONETIZATION_AT_RISK' | 'HIGH_STRIKE_RISK' | 'UNAUDITED';
  strikeRiskPct?: number;
  snapshots?: VideoSnapshot[];
}

export interface ChannelHistorySnapshot {
  timestamp: number;
  totalViews: number;
  totalLikes: number;
}

export interface TrackedChannel {
  id: string; // e.g. "UCX6OQ3DkcsbYNE6H8uQQuVA" or "@handle"
  handle: string; // e.g. "@MrBeast"
  title: string;
  customUrl: string; // e.g. "https://www.youtube.com/@MrBeast"
  avatar: string;
  banner?: string;
  subscribers: string; // e.g. "318M subscribers"
  subscriberCount: number;
  videoCount: number;
  totalViews: string;
  totalViewsCount: number;
  description?: string;
  lastUpdated: number; // Date.now()
  total24hLikes: number;
  total24hViews: number;
  total7dLikes: number;
  total7dViews: number;
  videos: TrackedVideo[];
  historySnapshots?: ChannelHistorySnapshot[];
  userId?: string;
  userEmail?: string;
  isGoogleConnected?: boolean;
  privacyProtected?: boolean;
}

export type TimeFilter = '24h' | '7d' | '30d' | 'all';
export type SortOption = '24h_likes' | '24h_views' | '7d_likes' | '7d_views' | 'total_views' | 'total_likes' | 'newest';
