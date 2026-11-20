import { describe, expect, it } from 'vitest';
import { FACTS } from '../src/data/index.js';
import { checkValue, findFacts, knownKeys, listSources, listTopics } from '../src/queries.js';

describe('Abfragen', () => {
  it('Themen mit Anzahl und ältestem Prüfdatum', () => {
    const topics = listTopics(FACTS);
    expect(topics.map((t) => t.topic)).toEqual(['darlehensrecht', 'foerderung-kfw-458', 'kredit-kfw-358-359', 'steuer-35c']);
    expect(topics.find((t) => t.topic === 'foerderung-kfw-458')!.count).toBe(FACTS.filter((f) => f.topic === 'foerderung-kfw-458').length);
    const older = FACTS.map((f) => ({ ...f, checkedAt: f.topic === 'steuer-35c' ? '2026-01-01' : f.checkedAt }));
    expect(listTopics(older).find((t) => t.topic === 'steuer-35c')!.oldestCheck).toBe('2026-01-01');
  });

  it('Filter werden kombiniert', () => {
    expect(findFacts(FACTS, { id: 'kfw458-grundfoerderung' })).toHaveLength(1);
    expect(findFacts(FACTS, { topic: 'steuer-35c' })).toHaveLength(1);
    expect(findFacts(FACTS, { key: 'tax.maxBonus' })[0].id).toBe('estg35c-steuerermaessigung');
    expect(findFacts(FACTS, { query: 'einkommensbonus' }).map((f) => f.id)).toEqual(['kfw458-einkommensbonus']);
    expect(findFacts(FACTS, { query: 'EINKOMMENSBONUS 40' }).map((f) => f.id)).toEqual(['kfw458-einkommensbonus']); // case-insensitive, all words
    expect(findFacts(FACTS, { topic: 'steuer-35c', query: 'einkommensbonus' })).toEqual([]);
    expect(findFacts(FACTS)).toHaveLength(FACTS.length);
    expect(findFacts(FACTS, { query: 'gibtesnicht' })).toEqual([]);
  });

  it('Quellen einmal je URL, mit allen Fakten', () => {
    const sources = listSources(FACTS);
    const urls = sources.map((s) => s.url);
    expect(new Set(urls).size).toBe(urls.length);
    const richtlinie = sources.find((s) => s.label.startsWith('BEG-EM-Richtlinie'))!;
    expect(richtlinie.factIds).toContain('kfw458-grundfoerderung');
    expect(richtlinie.factIds.length).toBeGreaterThan(3);
    const fresher = FACTS.map((f, i) => ({ ...f, sources: f.sources.map((s) => ({ ...s, retrievedAt: i === 0 ? '2026-12-31' : s.retrievedAt })) }));
    expect(listSources(fresher).find((s) => s.url === FACTS[0].sources[0].url)!.retrievedAt).toBe('2026-12-31');
  });

  it('check_value: gleich, abweichend, unbekannt', () => {
    expect(checkValue(FACTS, 'funding.grundRate', 0.3)).toMatchObject({ status: 'gleich', reference: 0.3 });
    expect(checkValue(FACTS, 'funding.grundRate', 0.3 + 1e-12).status).toBe('gleich');
    const diff = checkValue(FACTS, 'funding.grundRate', 0.25);
    expect(diff).toMatchObject({ status: 'abweichend', yours: 0.25, reference: 0.3 });
    expect(diff.fact).toMatchObject({ id: 'kfw458-grundfoerderung', status: 'bestaetigt' });
    expect(diff.fact!.sources.length).toBeGreaterThan(0);
    expect(checkValue(FACTS, 'tax.deadline', '2029-12').status).toBe('gleich');
    expect(checkValue(FACTS, 'tax.deadline', '2030-12').status).toBe('abweichend');
    expect(checkValue(FACTS, 'tax.deadline', 2029).status).toBe('abweichend'); // other type is not equal
    expect(checkValue(FACTS, 'gibt.es.nicht', 1)).toEqual({ key: 'gibt.es.nicht', status: 'unbekannt', yours: 1 });
  });

  it('bekannte Feldpfade sortiert, ohne Doppelte', () => {
    const keys = knownKeys(FACTS);
    expect(keys).toEqual([...keys].sort());
    expect(keys).toContain('funding.grundRate');
    expect(new Set(keys).size).toBe(keys.length);
  });
});
