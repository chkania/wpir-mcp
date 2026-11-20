import type { ServerResponse } from 'node:http';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/mcp-server.js', () => ({
  createServer: () => {
    throw new Error('geheimer interner Fehler mit Details');
  },
}));

const { default: handler } = await import('../api/mcp.js');

function fakeResponse() {
  const res = { headersSent: false, status: 0, headers: {} as Record<string, unknown>, body: '' };
  const api = {
    writeHead(status: number, headers: Record<string, unknown>) {
      res.status = status;
      res.headers = headers;
      res.headersSent = true;
      return api;
    },
    end(body: string) {
      res.body = body;
    },
    on() {
      return api;
    },
  };
  return { res, api: api as unknown as ServerResponse, state: res };
}

describe('F1.4 Fehler im Server', () => {
  it('antwortet mit 500 und ohne interne Details, protokolliert nur die Fehlermeldung', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { api, state } = fakeResponse();
    await handler({ method: 'POST', body: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'check_value', arguments: { key: 'geheim', value: 42 } } } } as never, api);
    expect(state.status).toBe(500);
    expect(JSON.parse(state.body)).toMatchObject({ jsonrpc: '2.0', error: { code: -32603, message: 'Interner Fehler' } });
    expect(state.body).not.toMatch(/geheim|Details/);
    // N1.3: the log carries the error message, not the content of the request
    const logged = JSON.stringify(log.mock.calls);
    expect(logged).toMatch(/geheimer interner Fehler/);
    expect(logged).not.toMatch(/"geheim"|42/);
    log.mockRestore();
  });
});
