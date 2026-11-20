import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import handler from '../api/mcp.js';

// The real Vercel handler behind a local HTTP server: what an agent in another repo talks to.
let http: Server;
let url: string;

beforeAll(async () => {
  http = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      void handler(Object.assign(req, { body: raw ? JSON.parse(raw) : undefined }), res);
    });
  });
  await new Promise<void>((resolve) => http.listen(0, resolve));
  url = `http://localhost:${(http.address() as AddressInfo).port}/mcp`;
});
afterAll(() => new Promise<void>((resolve) => http.close(() => resolve())));

const rpc = (body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) });

describe('MCP über HTTP (api/mcp.ts)', () => {
  it('antwortet auf tools/list mit den Werkzeugen', async () => {
    const res = await rpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.result.tools.map((t: { name: string }) => t.name)).toContain('check_value');
  });

  it('ruft check_value über HTTP auf', async () => {
    const res = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'check_value', arguments: { key: 'funding.grundRate', value: 0.3 } } });
    const body = await res.json();
    expect(JSON.parse(body.result.content[0].text)).toMatchObject({ status: 'gleich', reference: 0.3 });
  });

  it('F3.5 ruft check_value mit einer Zahl als Text über HTTP auf (so senden es Agenten)', async () => {
    const res = await rpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'check_value', arguments: { key: 'funding.grundRate', value: '0.3' } } });
    const body = await res.json();
    expect(JSON.parse(body.result.content[0].text)).toMatchObject({ status: 'gleich', yours: '0.3', interpretedAs: 0.3 });
  });

  it('GET ist nicht erlaubt (zustandslos, nur POST)', async () => {
    const res = await fetch(url);
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('POST');
  });
});
