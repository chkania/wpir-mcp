import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { describe, expect, it } from 'vitest';
import { createServer } from '../src/mcp-server.js';
import { EXPECTED_KEYS } from './keys-fixture.js';

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

  it('F2.2 list_topics nennt die acht Themen', async () => {
    const client = await connect();
    expect(json(await client.callTool({ name: 'list_topics', arguments: {} })).length).toBe(8);
  });

  it('F2.2 und F2.7 get_facts filtert nach neuen Themen und findet Regel-Fakten per Freitext', async () => {
    const client = await connect();
    const strom = json(await client.callTool({ name: 'get_facts', arguments: { topic: 'strom-netz' } }));
    expect(strom).toHaveLength(3);
    const co2 = json(await client.callTool({ name: 'get_facts', arguments: { topic: 'co2-preis' } }));
    expect(co2.map((f: { id: string }) => f.id)).toEqual(['behg-co2-preiskorridor-2026']);
    const byText = json(await client.callTool({ name: 'get_facts', arguments: { query: 'co2Path' } }));
    expect(byText.map((f: { id: string }) => f.id)).toEqual(['behg-co2-preiskorridor-2026']);
    const para = json(await client.callTool({ name: 'get_facts', arguments: { query: 'para14aReduction' } }));
    expect(para.map((f: { id: string }) => f.id)).toEqual(['para14a-modul-1-regel']);
  });

  it('F2.2 get_facts lehnt ein unbekanntes Thema ab', async () => {
    const client = await connect();
    const bad = await client.callTool({ name: 'get_facts', arguments: { topic: 'gibtesnicht' } }).catch((e: Error) => e);
    expect(bad instanceof Error || (bad as { isError?: boolean }).isError === true).toBe(true);
  });

  it('F2.6 und F2.8 list_keys nennt die fünf Rechtswerte, nicht die Felder ohne Referenzwert', async () => {
    const client = await connect();
    const keys: string[] = json(await client.callTool({ name: 'list_keys', arguments: {} }));
    expect([...keys].sort()).toEqual(EXPECTED_KEYS);
    for (const k of ['prices.co2Path', 'prices.gridCo2Path', 'prices.gasCo2Factor', 'prices.oilCo2Factor', 'heatPump.para14aReduction']) expect(keys, k).not.toContain(k);
  });

  it('F2.6 check_value prüft Rechtswerte über den SDK-Client', async () => {
    const client = await connect();
    const vat = json(await client.callTool({ name: 'check_value', arguments: { key: 'general.vat', value: '0.19' } }));
    expect(vat).toMatchObject({ status: 'gleich', interpretedAs: 0.19, fact: { id: 'ustg12-regelsteuersatz' } });
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'prices.bioSteps', value: '2029:10, 2030:15, 2035:30, 2040:60' } })).status).toBe('gleich');
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'prices.co2Path', value: 60 } })).status).toBe('unbekannt');
  });

  it('list_sources und list_keys liefern Daten', async () => {
    const client = await connect();
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
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'tax.maxBonus', value: '40000' } }))).toMatchObject({ status: 'gleich', interpretedAs: 40000 });
    expect(json(await client.callTool({ name: 'check_value', arguments: { key: 'x.y', value: true } })).status).toBe('unbekannt');
    const bad = await client.callTool({ name: 'check_value', arguments: { key: '', value: 1 } }).catch((e: Error) => e);
    const failed = bad instanceof Error || (bad as { isError?: boolean }).isError === true;
    expect(failed).toBe(true);
  });
});
