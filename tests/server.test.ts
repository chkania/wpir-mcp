import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { describe, expect, it } from 'vitest';
import { createServer } from '../src/server';

async function connect() {
  const server = createServer();
  const client = new Client({ name: 'test', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(a), client.connect(b)]);
  return client;
}

const json = (result: unknown) => JSON.parse((result as { content: { text: string }[] }).content[0].text);

describe('MCP-Server (Werkzeuge)', () => {
  it('bietet genau die erwarteten Werkzeuge, alle nur lesend', async () => {
    const { tools } = await (await connect()).listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(['check_value', 'get_facts', 'list_keys', 'list_sources', 'list_topics']);
    for (const t of tools) expect(t.annotations?.readOnlyHint, t.name).toBe(true);
  });

  it('list_topics, list_sources und list_keys liefern Daten', async () => {
    const client = await connect();
    expect(json(await client.callTool({ name: 'list_topics', arguments: {} })).length).toBe(4);
    expect(json(await client.callTool({ name: 'list_sources', arguments: {} })).length).toBeGreaterThan(3);
    expect(json(await client.callTool({ name: 'list_keys', arguments: {} })).length).toBeGreaterThan(30);
  });

  it('get_facts filtert nach Feldpfad und Thema', async () => {
    const client = await connect();
    const byKey = json(await client.callTool({ name: 'get_facts', arguments: { key: 'funding.maxRate' } }));
    expect(byKey.map((f: { id: string }) => f.id)).toEqual(['kfw458-hoechstfoerdersatz']);
    const byTopic = json(await client.callTool({ name: 'get_facts', arguments: { topic: 'darlehensrecht' } }));
    expect(byTopic).toHaveLength(1);
  });

  it('check_value vergleicht und lehnt ungültige Eingaben ab', async () => {
    const client = await connect();
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'tax.maxBonus', value: 40000 } })).status).toBe('gleich');
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'tax.maxBonus', value: 30000 } })).status).toBe('abweichend');
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'x.y', value: true } })).status).toBe('unbekannt');
    const bad = await client.callTool({ name: 'check_value', arguments: { key: '', value: 1 } }).catch((e: Error) => e);
    const failed = bad instanceof Error || (bad as { isError?: boolean }).isError === true;
    expect(failed).toBe(true);
  });
});
