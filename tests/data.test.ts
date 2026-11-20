import { describe, expect, it } from 'vitest';
import { FACTS } from '../src/data/index.js';
import { defineFacts, TOPICS } from '../src/facts.js';

describe('Wissensbasis: Qualität der Daten', () => {
  it('Fakt-IDs sind eindeutig', () => {
    const ids = FACTS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('jeder Feldpfad hat genau einen Referenzwert', () => {
    const keys = FACTS.flatMap((f) => Object.keys(f.refs));
    expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
  });

  it('jedes Thema hat mindestens einen Fakt und jeder Fakt ein bekanntes Thema', () => {
    for (const t of TOPICS) expect(FACTS.some((f) => f.topic === t), t).toBe(true);
    for (const f of FACTS) expect(TOPICS).toContain(f.topic);
  });

  it('Quellen sind https-Adressen und das Lesedatum liegt nicht nach dem Prüfdatum', () => {
    for (const f of FACTS) {
      for (const s of f.sources) {
        expect(s.url, f.id).toMatch(/^https:\/\//);
        expect(s.retrievedAt <= f.checkedAt, `${f.id}: Lesedatum ${s.retrievedAt} nach Prüfdatum ${f.checkedAt}`).toBe(true);
      }
    }
  });

  it('Gültigkeit ist in sich stimmig', () => {
    for (const f of FACTS) if (f.validFrom && f.validUntil) expect(f.validFrom <= f.validUntil, f.id).toBe(true);
  });

  it('Feldpfade haben die Form bereich.feld', () => {
    for (const f of FACTS) for (const k of Object.keys(f.refs)) expect(k, f.id).toMatch(/^[a-z][A-Za-z0-9]*\.[a-z][A-Za-z0-9]*$/);
  });

  it('defineFacts weist ungültige Fakten mit ihrer ID zurück', () => {
    expect(() => defineFacts([{ id: 'Falsch ID', topic: 'steuer-35c', title: 't', summary: 's', status: 'annahme', checkedAt: '2026-11-18', sources: [] }])).toThrow(/Falsch ID/);
    expect(() => defineFacts([{ id: 'ok', topic: 'steuer-35c', title: 't', summary: 's', status: 'annahme', checkedAt: '18.11.2026', sources: [{ label: 'x', url: 'https://example.org', retrievedAt: '2026-11-18' }] }])).toThrow(/ok/);
  });
});
