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

  it('F2.9 kfw358-359-laufzeit: refs leer, validFrom 2026-09-24, Status bestätigt, Prüfdatum 2026-11-23, summary mit den Regelwerten', () => {
    const f = FACTS.find((x) => x.id === 'kfw358-359-laufzeit')!;
    expect(f.topic).toBe('kredit-kfw-358-359');
    expect(f.title).toBe('KfW 358/359: Laufzeit, tilgungsfreie Anlaufjahre und Zinsbindung');
    expect(f.refs).toEqual({});
    expect(f.validFrom).toBe('2026-09-24');
    expect(f.validUntil).toBeUndefined();
    expect(f.status).toBe('bestaetigt');
    expect(f.checkedAt).toBe('2026-11-23');
    for (const part of ['4 Jahre', '35 Jahre', 'ersten 10 Jahre']) expect(f.summary, part).toContain(part);
    for (const field of ['financing.kfwTermYears', 'financing.kfwGraceYears', 'financing.kfwFixYears']) expect(f.summary, field).toContain(field);
  });

  it('F2.9 kfw358-359-laufzeit: Quelle ist das Merkblatt 358/359 mit demselben Label und URL, gelesen am 2026-11-23', () => {
    const f = FACTS.find((x) => x.id === 'kfw358-359-laufzeit')!;
    expect(f.sources).toHaveLength(1);
    expect(f.sources[0]).toEqual({ label: 'KfW-Merkblatt 358/359 (Stand 09/2026)', url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005135_M_358_359.pdf', retrievedAt: '2026-11-23' });
  });

  it('F2.10 kfw458-bewilligungszeitraum: refs nur funding.approvalMonths = 36, kein validFrom, Status bestätigt, Prüfdatum 2026-11-23', () => {
    const f = FACTS.find((x) => x.id === 'kfw458-bewilligungszeitraum')!;
    expect(f.topic).toBe('foerderung-kfw-458');
    expect(f.refs).toEqual({ 'funding.approvalMonths': 36 });
    expect(f.validFrom).toBeUndefined();
    expect(f.status).toBe('bestaetigt');
    expect(f.checkedAt).toBe('2026-11-23');
    for (const part of ['36 Monaten', 'ab Zusage', 'sechs Monate']) expect(f.summary, part).toContain(part);
    expect(f.note).toContain('Zusage');
    expect(f.note).toContain('A10');
  });

  it('F2.10 kfw458-bewilligungszeitraum: Quelle ist das Merkblatt 458 mit demselben Label und URL, gelesen am 2026-11-23', () => {
    const f = FACTS.find((x) => x.id === 'kfw458-bewilligungszeitraum')!;
    expect(f.sources).toEqual([{ label: 'KfW-Merkblatt 458 (Stand 09/2026)', url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005131_M_458.pdf', retrievedAt: '2026-11-23' }]);
  });

  it('F2.9 und F2.10 die sechs bestehenden Merkblatt-Fakten behalten Lesedatum 2026-11-11 und Prüfdatum 2026-11-18 (F2.4)', () => {
    const merkblatt = FACTS.filter((f) => !['kfw358-359-laufzeit', 'kfw458-bewilligungszeitraum'].includes(f.id) && f.sources.some((s) => s.label.includes('Merkblatt')));
    expect(merkblatt.map((f) => f.id).sort()).toEqual(['kfw358-359-kreditrahmen', 'kfw358-359-sondertilgung', 'kfw458-einkommensbonus', 'kfw458-grundfoerderung', 'kfw458-hoechstfoerdersatz', 'kfw458-klimageschwindigkeitsbonus']);
    for (const f of merkblatt) {
      expect(f.checkedAt, f.id).toBe('2026-11-18');
      for (const s of f.sources.filter((x) => x.label.includes('Merkblatt'))) expect(s.retrievedAt, f.id).toBe('2026-11-11');
    }
  });

  it('defineFacts weist ungültige Fakten mit ihrer ID zurück', () => {
    expect(() => defineFacts([{ id: 'Falsch ID', topic: 'steuer-35c', title: 't', summary: 's', status: 'annahme', checkedAt: '2026-11-18', sources: [] }])).toThrow(/Falsch ID/);
    expect(() => defineFacts([{ id: 'ok', topic: 'steuer-35c', title: 't', summary: 's', status: 'annahme', checkedAt: '18.11.2026', sources: [{ label: 'x', url: 'https://example.org', retrievedAt: '2026-11-18' }] }])).toThrow(/ok/);
  });
});
