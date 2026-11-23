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

  it('F2.6, F2.8 und F2.10 list_keys nennt die Rechtswerte und den Bewilligungszeitraum, nicht die Felder ohne Referenzwert', async () => {
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

  it('F2.9 get_facts topic kredit-kfw-358-359 liefert die Laufzeit-Regel mit validFrom 2026-09-24 und leerem refs', async () => {
    const client = await connect();
    const facts = json(await client.callTool({ name: 'get_facts', arguments: { topic: 'kredit-kfw-358-359' } }));
    const laufzeit = facts.find((f: { id: string }) => f.id === 'kfw358-359-laufzeit');
    expect(laufzeit).toMatchObject({ validFrom: '2026-09-24', refs: {} });
    for (const part of ['4 Jahre', '35 Jahre', 'ersten 10 Jahre']) expect(laufzeit.summary, part).toContain(part);
  });

  it('F2.9 get_facts query kfwFixYears, kfwTermYears und kfwGraceYears liefern genau die Laufzeit-Regel', async () => {
    const client = await connect();
    for (const query of ['kfwFixYears', 'kfwTermYears', 'kfwGraceYears']) {
      const facts = json(await client.callTool({ name: 'get_facts', arguments: { query } }));
      expect(facts.map((f: { id: string }) => f.id), query).toEqual(['kfw358-359-laufzeit']);
    }
  });

  it('F2.9 check_value financing.kfwTermYears, kfwGraceYears und kfwFixYears ist unbekannt, mit Zahl und Text', async () => {
    const client = await connect();
    for (const key of ['financing.kfwTermYears', 'financing.kfwGraceYears', 'financing.kfwFixYears']) {
      expect(json(await client.callTool({ name: 'check_value', arguments: { key, value: 10 } })), key).toEqual({ key, status: 'unbekannt', yours: 10 });
      expect(json(await client.callTool({ name: 'check_value', arguments: { key, value: '10' } })), key).toEqual({ key, status: 'unbekannt', yours: '10' });
    }
  });

  it('F2.10 get_facts key funding.approvalMonths und query Bewilligungszeitraum liefern genau den Bewilligungsfakt', async () => {
    const client = await connect();
    const byKey = json(await client.callTool({ name: 'get_facts', arguments: { key: 'funding.approvalMonths' } }));
    expect(byKey.map((f: { id: string }) => f.id)).toEqual(['kfw458-bewilligungszeitraum']);
    const byText = json(await client.callTool({ name: 'get_facts', arguments: { query: 'Bewilligungszeitraum' } }));
    expect(byText.map((f: { id: string }) => f.id)).toEqual(['kfw458-bewilligungszeitraum']);
    expect(byText[0].note).toContain('Zusage');
    expect(byText[0].summary).toContain('36 Monaten');
  });

  it('F2.10 check_value funding.approvalMonths: 36 gleich, Text "36" gelesen, 24 und "2029-12" abweichend', async () => {
    const client = await connect();
    const call = async (value: number | string) => json(await client.callTool({ name: 'check_value', arguments: { key: 'funding.approvalMonths', value } }));
    expect(await call(36)).toMatchObject({ status: 'gleich', reference: 36, fact: { id: 'kfw458-bewilligungszeitraum' } });
    expect(await call('36')).toMatchObject({ status: 'gleich', interpretedAs: 36 });
    expect((await call(24)).status).toBe('abweichend');
    expect((await call('2029-12')).status).toBe('abweichend');
  });
});
