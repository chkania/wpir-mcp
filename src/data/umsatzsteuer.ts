import { defineFacts } from '../facts.js';
import { USTG_12 } from './sources.js';

/** Umsatzsteuer. Reference value is the one the calculator (wpir) uses. */
export const umsatzsteuer = defineFacts([
  {
    id: 'ustg12-regelsteuersatz',
    topic: 'umsatzsteuer',
    title: 'Umsatzsteuer: Regelsteuersatz',
    summary: 'Der Regelsteuersatz der Umsatzsteuer beträgt 19 % (Referenz `general.vat`).',
    refs: { 'general.vat': 0.19 },
    status: 'bestaetigt',
    checkedAt: '2026-11-20',
    sources: [USTG_12],
    note: 'Regelsatz. Ermäßigter Satz für Gas, Heizöl, Strom nicht geprüft (Anlage 2 UStG).',
  },
]);
