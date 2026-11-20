import { defineFacts } from '../facts.js';
import { BEG_EM_RICHTLINIE, KFW_358_359_MERKBLATT, KFW_358_359_SEITE } from './sources.js';

/** KfW 358/359 (Ergänzungskredit). */
export const kfw358359 = defineFacts([
  {
    id: 'kfw358-359-kreditrahmen',
    topic: 'kredit-kfw-358-359',
    title: 'KfW 358/359: Kredithöhe und Einkommensgrenze',
    summary: 'Ergänzungskredit bis 120.000 € je Wohneinheit. Der zinsverbilligte Kredit 358 gilt bis 90.000 € zu versteuerndem Haushaltseinkommen.',
    refs: { 'funding.loanMaxPerUnit': 120000, 'funding.loan358IncomeLimit': 90000 },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_358_359_MERKBLATT],
    note: 'Richtlinie Nr. 8.5.1 (Kredithöhe) und 8.5.2 a (Zinsverbilligung bis 90.000 €).',
  },
  {
    id: 'kfw358-359-zinssaetze',
    topic: 'kredit-kfw-358-359',
    title: 'KfW 358/359: Zinssätze',
    summary: 'Zinssatz bei 20 Jahren Laufzeit: Kredit 358 2,2 % (interpoliert), Kredit 359 4,6 %.',
    refs: { 'financing.kfwRate358': 0.022, 'financing.kfwRate359': 0.046 },
    status: 'sekundaerquelle',
    checkedAt: '2026-11-18',
    sources: [KFW_358_359_SEITE],
    note: 'Auf der KfW-Seite stehen die Zinsen nicht; die Werte stammen aus einer Sekundärquelle (hausvoraus.de, 10.11.2026), 358 für 20 Jahre interpoliert. Bei einer Prüfung die tagesaktuellen KfW-Konditionen heranziehen.',
  },
  {
    id: 'kfw358-359-sondertilgung',
    topic: 'kredit-kfw-358-359',
    title: 'KfW 358/359: Sondertilgung',
    summary:
      'Außerplanmäßige Tilgungen sind ab einem Mindestbetrag von 5.000 € innerhalb der ersten Zinsbindung jederzeit kostenfrei möglich. Nach Ablauf der ersten Zinsbindung nur noch vollständig und gegen Vorfälligkeitsentschädigung. Gilt auch für den Zuschuss als Sondertilgung.',
    refs: { 'financing.kfwMinPrepay': 5000 },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [KFW_358_359_MERKBLATT],
  },
]);
