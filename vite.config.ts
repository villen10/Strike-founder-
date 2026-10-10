import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { runGeminiVideoAudit, runGeminiAppealGenerator } from './server/auditEngine';

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function apiServerPlugin(): Plugin {
  return {
    name: 'strikeguard-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/audit' && req.method === 'POST') {
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

        if (req.url === '/api/appeal' && req.method === 'POST') {
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

