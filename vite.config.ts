import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { runGeminiVideoAudit, runGeminiAppealGenerator } from './server/auditEngine';
import { fetchYouTubeChannel } from './server/youtubeService';

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: any) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function apiServerPlugin(): Plugin {
  return {
    name: 'strike-founder-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = (req.url || '').split('?')[0];

        if ((urlPath === '/api/audit' || urlPath === '/api/audit/') && req.method === 'POST') {
          try {
            const data = await parseJsonBody(req);
            const report = await runGeminiVideoAudit(data);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, report }));
          } catch (err: any) {
            console.error('Audit API error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Audit failed' }));
          }
          return;
        }

        if ((urlPath === '/api/appeal' || urlPath === '/api/appeal/') && req.method === 'POST') {
          try {
            const data = await parseJsonBody(req);
            const result = await runGeminiAppealGenerator(data);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, result }));
          } catch (err: any) {
            console.error('Appeal API error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Appeal generation failed' }));
          }
          return;
        }

        if ((urlPath === '/api/youtube/channel' || urlPath === '/api/youtube/channel/') && req.method === 'POST') {
          try {
            const { query, previousData } = await parseJsonBody(req);
            if (!query) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Channel URL or Handle is required' }));
              return;
            }
            const channel = await fetchYouTubeChannel(query, previousData);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, channel }));
          } catch (err: any) {
            console.error('YouTube channel API error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Failed to fetch YouTube channel' }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

