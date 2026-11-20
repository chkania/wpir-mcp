import { describe, expect, it } from 'vitest';
import { FACTS } from '../src/data/index.js';
import { defineFacts, STATUS, TOPICS } from '../src/facts.js';

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

  it('F2.2 die acht Themen sind die der Anforderung, jedes mit mindestens einem Fakt', () => {
    expect([...TOPICS]).toEqual([
      'foerderung-kfw-458',
      'kredit-kfw-358-359',
      'steuer-35c',
      'darlehensrecht',
      'co2-preis',
      'gebaeudemodernisierung',
      'strom-netz',
      'umsatzsteuer',
    ]);
    const count = (t: string) => FACTS.filter((f) => f.topic === t).length;
    expect(count('strom-netz')).toBe(3);
    for (const t of ['co2-preis', 'gebaeudemodernisierung', 'umsatzsteuer']) expect(count(t), t).toBeGreaterThanOrEqual(1);
  });

  it('F2.6 jeder der fünf Rechtswerte steht in genau einem Fakt mit Status, Prüfdatum und Quelle', () => {
    for (const key of ['general.vat', 'heatPump.feedInCt', 'heatPump.smartMeterFee', 'prices.bioEnabled', 'prices.bioSteps']) {
      const facts = FACTS.filter((f) => key in f.refs);
      expect(facts, key).toHaveLength(1);
      expect(STATUS, key).toContain(facts[0].status);
      expect(facts[0].checkedAt, key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(facts[0].sources.length, key).toBeGreaterThan(0);
    }
  });

  it('F2.7 die zwei Regeln ohne Referenzwert haben leere refs und nennen das Rechnerfeld in der summary', () => {
    const co2 = FACTS.find((f) => f.id === 'behg-co2-preiskorridor-2026')!;
    const para14a = FACTS.find((f) => f.id === 'para14a-modul-1-regel')!;
    expect(co2.refs).toEqual({});
    expect(co2.summary).toContain('prices.co2Path');
    expect(para14a.refs).toEqual({});
    expect(para14a.summary).toContain('heatPump.para14aReduction');
  });

  it('F2.7 behg-co2-preiskorridor-2026: validUntil 2026-12-31, note nennt 2027, summary nicht', () => {
    const co2 = FACTS.find((f) => f.id === 'behg-co2-preiskorridor-2026')!;
    expect(co2.validUntil).toBe('2026-12-31');
    expect(co2.note).toContain('2027');
    expect(co2.summary).not.toContain('2027');
  });

  it('F2.6 msbg30-preisobergrenze-imsys: summary nennt 130 € insgesamt und 80 € für den Netzbetreiber', () => {
    const msbg = FACTS.find((f) => f.id === 'msbg30-preisobergrenze-imsys')!;
    expect(msbg.summary).toContain('130 €');
    expect(msbg.summary).toContain('80 €');
    expect(msbg.note).toContain('130 €');
    expect(msbg.note).toContain('Höchstbetrag');
  });

  it('F2.3 Ausnahme: prices.bioSteps ist der einzige Textwert in den Referenzen, der kein Monat ist', () => {
    const texts = FACTS.flatMap((f) => Object.entries(f.refs)).filter(([, v]) => typeof v === 'string' && !/^\d{4}-\d{2}$/.test(v));
    expect(texts.map(([k]) => k)).toEqual(['prices.bioSteps']);
  });

  it('defineFacts weist ungültige Fakten mit ihrer ID zurück', () => {
    expect(() => defineFacts([{ id: 'Falsch ID', topic: 'steuer-35c', title: 't', summary: 's', status: 'annahme', checkedAt: '2026-11-18', sources: [] }])).toThrow(/Falsch ID/);
    expect(() => defineFacts([{ id: 'ok', topic: 'steuer-35c', title: 't', summary: 's', status: 'annahme', checkedAt: '18.11.2026', sources: [{ label: 'x', url: 'https://example.org', retrievedAt: '2026-11-18' }] }])).toThrow(/ok/);
  });
});
