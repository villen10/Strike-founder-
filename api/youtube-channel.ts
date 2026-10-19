import { fetchYouTubeChannel } from '../server/youtubeService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { query, previousData } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Channel URL or Handle is required' });
    }
    const channel = await fetchYouTubeChannel(query, previousData);
    return res.status(200).json({ success: true, channel });
  } catch (err: any) {
    console.error('Vercel YouTube channel API error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch YouTube channel' });
  }
}
