import { describe, expect, it } from 'vitest';
import { FACTS } from '../src/data/index.js';
import { checkValue, findFacts, knownKeys, listSources, listTopics, readAsReference } from '../src/queries.js';
import { BASE_KEYS, EXPECTED_KEYS, NEW_KEYS } from './keys-fixture.js';

describe('Abfragen', () => {
  it('Themen mit Anzahl und ältestem Prüfdatum', () => {
    const topics = listTopics(FACTS);
    expect(topics.map((t) => t.topic)).toEqual([
      'co2-preis',
      'darlehensrecht',
      'foerderung-kfw-458',
      'gebaeudemodernisierung',
      'kredit-kfw-358-359',
      'steuer-35c',
      'strom-netz',
      'umsatzsteuer',
    ]);
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

  it('F3.5 Zahlen und Wahrheitswerte als Text werden wie die Werte gelesen', () => {
    const num = checkValue(FACTS, 'funding.grundRate', '0.3');
    expect(num).toMatchObject({ status: 'gleich', yours: '0.3', interpretedAs: 0.3, reference: 0.3 });
    expect(checkValue(FACTS, 'financing.kfwMinPrepay', ' 5000 ')).toMatchObject({ status: 'gleich', interpretedAs: 5000 });
    expect(checkValue(FACTS, 'tax.maxBonus', '1e4')).toMatchObject({ status: 'abweichend', interpretedAs: 10000 });
    // a real number needs no reading
    expect(checkValue(FACTS, 'funding.grundRate', 0.3)).not.toHaveProperty('interpretedAs');
    // text that is no number: no reading, stays different
    for (const bad of ['', '  ', 'abc', '0,3', '0.3 €', 'NaN', 'Infinity']) {
      const r = checkValue(FACTS, 'funding.grundRate', bad);
      expect(r.status, bad).toBe('abweichend');
      expect(r, bad).not.toHaveProperty('interpretedAs');
    }
    // text references are compared as text, also if the value looks like a number
    expect(checkValue(FACTS, 'tax.deadline', '2029-12')).toMatchObject({ status: 'gleich' });
    expect(checkValue(FACTS, 'tax.deadline', '2029-12')).not.toHaveProperty('interpretedAs');
  });

  it('F3.5 readAsReference liest nur Text bei Zahl- oder Wahrheitswert-Referenz', () => {
    expect(readAsReference('0.5', 1)).toBe(0.5);
    expect(readAsReference('TRUE', true)).toBe(true);
    expect(readAsReference(' false ', false)).toBe(false);
    expect(readAsReference('ja', true)).toBeUndefined();
    expect(readAsReference('0.5', 'text')).toBeUndefined();
    expect(readAsReference(0.5, 1)).toBeUndefined();
    expect(readAsReference(true, false)).toBeUndefined();
  });

  it('bekannte Feldpfade sortiert, ohne Doppelte', () => {
    const keys = knownKeys(FACTS);
    expect(keys).toEqual([...keys].sort());
    expect(keys).toContain('funding.grundRate');
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('F2.6 und F2.8 list_keys: Menge = Basis-Schlüssel plus genau die fünf Rechtswerte', () => {
    expect(knownKeys(FACTS)).toEqual(EXPECTED_KEYS);
    expect(EXPECTED_KEYS).toHaveLength(BASE_KEYS.length + NEW_KEYS.length);
  });

  it('F2.6 general.vat: 0.19 gleich mit Fakt, Text "0.19" gelesen, 0.2 abweichend', () => {
    expect(checkValue(FACTS, 'general.vat', 0.19)).toMatchObject({ status: 'gleich', reference: 0.19, fact: { id: 'ustg12-regelsteuersatz' } });
    expect(checkValue(FACTS, 'general.vat', '0.19')).toMatchObject({ status: 'gleich', interpretedAs: 0.19 });
    expect(checkValue(FACTS, 'general.vat', 0.2).status).toBe('abweichend');
  });

  it('F2.6 heatPump.feedInCt: 7.7 gleich mit Gültigkeit, "7,7" mit Dezimalkomma abweichend ohne Lesart', () => {
    expect(checkValue(FACTS, 'heatPump.feedInCt', 7.7)).toMatchObject({ status: 'gleich', fact: { validFrom: '2026-08-01', validUntil: '2026-12-31' } });
    const comma = checkValue(FACTS, 'heatPump.feedInCt', '7,7');
    expect(comma.status).toBe('abweichend');
    expect(comma).not.toHaveProperty('interpretedAs');
  });

  it('F2.6 heatPump.smartMeterFee: 100 gleich, 80 und 0 abweichend mit Höchstbetrag-Hinweis', () => {
    expect(checkValue(FACTS, 'heatPump.smartMeterFee', 100).status).toBe('gleich');
    for (const v of [80, 0]) {
      const r = checkValue(FACTS, 'heatPump.smartMeterFee', v);
      expect(r.status, String(v)).toBe('abweichend');
      expect(r.fact!.note, String(v)).toContain('Höchstbetrag');
    }
  });

  it('F2.6 prices.bioEnabled: "true" gleich mit Lesart, false abweichend', () => {
    expect(checkValue(FACTS, 'prices.bioEnabled', 'true')).toMatchObject({ status: 'gleich', interpretedAs: true });
    expect(checkValue(FACTS, 'prices.bioEnabled', false).status).toBe('abweichend');
  });

  it('F2.6 und F2.3 prices.bioSteps: Text wird exakt verglichen, Ausnahme im Hinweis', () => {
    const steps = '2029:10, 2030:15, 2035:30, 2040:60';
    const same = checkValue(FACTS, 'prices.bioSteps', steps);
    expect(same).toMatchObject({ status: 'gleich', fact: { id: 'gmodg-bio-treppe' } });
    expect(same).not.toHaveProperty('interpretedAs');
    expect(same.fact!.note).toContain('Ausnahme zu F2.3');
    expect(checkValue(FACTS, 'prices.bioSteps', '2029:10, 2030:15, 2035:30').status).toBe('abweichend');
    expect(checkValue(FACTS, 'prices.bioSteps', '2029:10,2030:15,2035:30,2040:60').status).toBe('abweichend');
    expect(checkValue(FACTS, 'prices.bioSteps', 10).status).toBe('abweichend');
  });

  it('F2.7 Regel-Fakten ohne Referenzwert sind über den Rechnerfeldnamen findbar', () => {
    expect(findFacts(FACTS, { query: 'co2Path' }).map((f) => f.id)).toEqual(['behg-co2-preiskorridor-2026']);
    expect(findFacts(FACTS, { query: 'para14aReduction' }).map((f) => f.id)).toEqual(['para14a-modul-1-regel']);
    for (const id of ['behg-co2-preiskorridor-2026', 'para14a-modul-1-regel']) {
      expect(findFacts(FACTS, { id })[0].refs, id).toEqual({});
    }
  });

  it('F2.8 Felder ohne Referenzwert sind unbekannt, auch bei Text', () => {
    for (const key of ['prices.co2Path', 'prices.gridCo2Path', 'prices.gasCo2Factor', 'prices.oilCo2Factor', 'heatPump.para14aReduction']) {
      expect(knownKeys(FACTS), key).not.toContain(key);
      expect(checkValue(FACTS, key, 130), key).toEqual({ key, status: 'unbekannt', yours: 130 });
      expect(checkValue(FACTS, key, '130'), key).toEqual({ key, status: 'unbekannt', yours: '130' });
    }
  });
});
