/**
 * Local MCP endpoint for development: `npm run dev` → http://localhost:3000/mcp (same handler as on Vercel).
 */
import { createServer } from 'node:http';
import handler from '../api/mcp';

const port = Number(process.env.PORT ?? 3000);

createServer((req, res) => {
  if (!req.url?.startsWith('/mcp')) {
    res.writeHead(404).end('Nicht gefunden – der MCP-Endpunkt ist /mcp');
    return;
  }
  const chunks: Buffer[] = [];
  req.on('data', (c: Buffer) => chunks.push(c));
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    let body: unknown;
    try {
      body = raw ? JSON.parse(raw) : undefined;
    } catch {
      body = undefined;
    }
    void handler(Object.assign(req, { body }), res);
  });
}).listen(port, () => console.log(`wpir-mcp lokal: http://localhost:${port}/mcp`));
