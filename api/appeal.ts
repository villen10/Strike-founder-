import { runGeminiAppealGenerator } from '../server/auditEngine';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await runGeminiAppealGenerator(data);
    return res.status(200).json({ success: true, result });
  } catch (err: any) {
    console.error('Vercel Appeal API error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Appeal generation failed' });
  }
}
