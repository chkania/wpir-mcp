import { defineFacts } from '../facts.js';
import { BGBL_2026_226, BUNDESTAG_GMODG } from './sources.js';

/** Gebäudemodernisierungsgesetz (Heizungsgesetz): Stufen für den Biomasse-Anteil. */
export const gebaeudemodernisierung = defineFacts([
  {
    id: 'gmodg-bio-treppe',
    topic: 'gebaeudemodernisierung',
    title: 'GModG: Stufen für den Biomasse-Anteil bei neuen Gas- und Ölheizungen',
    summary:
      'Neu eingebaute Gas- und Ölheizungen müssen ab 2029 einen steigenden Anteil Biomasse nutzen: 10 % (2029), 15 % (2030), 30 % (2035), 60 % (2040). Referenzwerte `prices.bioEnabled` und `prices.bioSteps`.',
    refs: { 'prices.bioEnabled': true, 'prices.bioSteps': '2029:10, 2030:15, 2035:30, 2040:60' },
    validFrom: '2029-01-01',
    status: 'sekundaerquelle',
    checkedAt: '2026-11-20',
    sources: [BUNDESTAG_GMODG, BGBL_2026_226],
    note: 'Stufen sind Prozentzahlen wie im Rechner (Ausnahme zu F2.3), für neu eingebaute Gas-/Ölheizungen jeweils ab Januar. Bundestag-Seite folgt dem Regierungsentwurf (Drs. 21/6278), maßgeblich Ausschussfassung (Drs. 21/7009). Stufen/§ 43 nur laut Sekundärquellen, Inkrafttreten 29.07.2026 nur laut Sekundärquellen. Offen: Geltung für 2026–2028 eingebaute Anlagen.',
  },
]);
