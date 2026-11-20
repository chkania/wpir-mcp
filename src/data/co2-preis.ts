import { defineFacts } from '../facts.js';
import { BEHG_10, BUNDESTAG_BEHG_KW39 } from './sources.js';

/** CO₂-Preis im Brennstoffemissionshandel. Rules without a reference value: the calculator's field is named in the summary. */
export const co2Preis = defineFacts([
  {
    id: 'behg-co2-preiskorridor-2026',
    topic: 'co2-preis',
    title: 'BEHG: CO₂-Preiskorridor 2026',
    summary:
      'Im Jahr 2026 liegt der CO₂-Preis im Brennstoffemissionshandel in einem Korridor von 55 bis 65 € je Zertifikat. Das Rechnerfeld `prices.co2Path` beruht auf diesem Korridor.',
    refs: {},
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    status: 'bestaetigt',
    checkedAt: '2026-11-20',
    sources: [BEHG_10, BUNDESTAG_BEHG_KW39],
    note: 'Korridor 55–65 €/Zertifikat 2026. Für 2027 hat der Bundestag am 15.10.2026 das Dritte Änderungsgesetz beschlossen (Drs. 21/7869, 21/8626; wieder 55–65 €), Bundesrat berät 20.11.2026 (Drs. 624/26); Ergebnis/Verkündung offen. Nach Verkündung Fakt prüfen. Ab 2028 ETS2, Marktpreis.',
  },
]);
