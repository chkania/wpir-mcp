import type { IncomingMessage, ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from '../src/mcp-server.js';

/** Request as Vercel passes it: Node request with the body already parsed. */
type VercelLikeRequest = IncomingMessage & { body?: unknown };

function methodNotAllowed(res: ServerResponse) {
  res.writeHead(405, { 'Content-Type': 'application/json', Allow: 'POST' });
  res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Methode nicht erlaubt: nur POST' }, id: null }));
}

/**
 * MCP endpoint (Streamable HTTP, stateless, JSON answers): one server per request, nothing is kept between requests.
 * Public and read-only; reachable at /mcp (vercel.json rewrites it to /api/mcp).
 */
export default async function handler(req: VercelLikeRequest, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') return methodNotAllowed(res);
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => {
      void transport.close();
      void server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP-Fehler', error instanceof Error ? error.message : 'unbekannt'); // never the request content (N1.3)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Interner Fehler' }, id: null }));
    }
  }
}
