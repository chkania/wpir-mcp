import { defineFacts } from '../facts.js';
import { BGB_500, BGB_502 } from './sources.js';

/** Vorfälligkeitsentschädigung bei Verbraucherdarlehen. */
export const darlehensrecht = defineFacts([
  {
    id: 'bgb502-vorfaelligkeitsentschaedigung',
    topic: 'darlehensrecht',
    title: '§ 502 BGB: Höchstgrenze der Vorfälligkeitsentschädigung',
    summary:
      'Verbraucherdarlehen dürfen jederzeit ganz oder teilweise vorzeitig zurückgezahlt werden (§ 500 Abs. 2 BGB). Die Vorfälligkeitsentschädigung darf 1 % des vorzeitig zurückgezahlten Betrags nicht überschreiten, beträgt die Restlaufzeit höchstens ein Jahr, 0,5 % (§ 502 Abs. 3 BGB). Sie darf nie mehr als die Sollzinsen bis zum Laufzeitende betragen.',
    refs: { 'financing.bankPrepayFee': 0.01, 'financing.bankPrepayFeeShort': 0.005 },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BGB_500, BGB_502],
  },
]);
