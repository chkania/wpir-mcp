import { defineFacts } from '../facts';
import { BEG_EM_RICHTLINIE, KFW_458_INFOBLATT, KFW_458_MERKBLATT } from './sources';

/** KfW 458 (Heizungsförderung für Privatpersonen). Reference values are the ones the calculator (wpir) uses. */
export const kfw458 = defineFacts([
  {
    id: 'kfw458-grundfoerderung',
    topic: 'foerderung-kfw-458',
    title: 'KfW 458: Grundförderung',
    summary: 'Grundförderung von 30 % der förderfähigen Kosten (Antragsmonat maßgeblich).',
    refs: { 'funding.grundRate': 0.3 },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_458_MERKBLATT],
  },
  {
    id: 'kfw458-grundfoerderung-ab-2027',
    topic: 'foerderung-kfw-458',
    title: 'KfW 458: Grundförderung für Wärmepumpen ab 2027 und Wertschöpfungs-Bonus',
    summary:
      'Ab Anträgen im 1. Quartal 2027 beträgt die Grundförderung für Wärmepumpen 15 %, dazu kommt bei Wärmepumpen mit Ursprung in der EU ein Wertschöpfungs-Bonus von 15 %.',
    refs: { 'funding.grundRateNew': 0.15, 'funding.grundRateNewFrom': '2027-01', 'funding.wsbRate': 0.15 },
    validFrom: '2027-01-01',
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_458_INFOBLATT],
    note: 'Richtlinie Nr. 8.4.1 c, 8.4.6 nennt „ab dem ersten Quartal 2027“; genauer Stichtag und Nachweis (Infoblatt Nr. 1.8) sind offen, angenommen wird 01/2027.',
  },
  {
    id: 'kfw458-klimageschwindigkeitsbonus',
    topic: 'foerderung-kfw-458',
    title: 'KfW 458: Klimageschwindigkeitsbonus',
    summary:
      '16 % für selbstgenutzte Wohneinheiten. Öl-, Kohle-, Gas-Etagen- und Nachtspeicherheizungen zählen unabhängig vom Alter, Gas- und Biomasseheizungen erst ab 20 Jahren Betrieb; die alte Heizung muss funktionstüchtig sein und fachgerecht entsorgt werden. Ab 02/2027 sinkt er halbjährlich (Februar/August) um 4 Prozentpunkte, ab Anträgen 08/2028 entfällt er.',
    refs: {
      'funding.kgbRate': 0.16,
      'funding.kgbStep': 0.04,
      'funding.kgbDegressionStart': '2027-02',
      'funding.kgbEnd': '2028-08',
      'funding.kgbMinGasAge': 20,
    },
    validUntil: '2028-07-31',
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_458_MERKBLATT],
  },
  {
    id: 'kfw458-einkommensbonus',
    topic: 'foerderung-kfw-458',
    title: 'KfW 458: Einkommensbonus',
    summary:
      'Für selbstgenutzte Wohneinheiten nach zu versteuerndem Haushaltseinkommen: bis 30.000 € 40 %, bis 40.000 € 30 %, bis 50.000 € 10 %. Mit kindergeldberechtigtem Kind unter 18 Jahren liegen die Grenzen 10.000 € höher.',
    refs: {
      'funding.incomeLimit1': 30000,
      'funding.incomeRate1': 0.4,
      'funding.incomeLimit2': 40000,
      'funding.incomeRate2': 0.3,
      'funding.incomeLimit3': 50000,
      'funding.incomeRate3': 0.1,
      'funding.incomeChildShift': 10000,
    },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_458_MERKBLATT],
  },
  {
    id: 'kfw458-hoechstfoerdersatz',
    topic: 'foerderung-kfw-458',
    title: 'KfW 458: Höchstfördersatz',
    summary: 'Der Zuschuss beträgt höchstens 70 % der förderfähigen Kosten, bei niedrigem Einkommen (bis 30.000 € bzw. 40.000 € mit Familienzuschlag) höchstens 80 %.',
    refs: { 'funding.maxRate': 0.7, 'funding.maxRateLowIncome': 0.8 },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_458_MERKBLATT],
  },
  {
    id: 'kfw458-foerderfaehige-kosten',
    topic: 'foerderung-kfw-458',
    title: 'KfW 458: Höchstbeträge der förderfähigen Kosten',
    summary:
      'Erste Wohneinheit 28.000 €, ab 02/2027 halbjährlich um 750 € weniger bis höchstens auf 22.000 € (ab 08/2030). Zweite bis sechste Wohneinheit je 15.000 €, ab der siebten je 8.000 €. Die Boni gelten nur für den Kostenanteil der selbstgenutzten Wohneinheit.',
    refs: {
      'funding.cap1': 28000,
      'funding.capStep': 750,
      'funding.capFloor': 22000,
      'funding.capDegressionStart': '2027-02',
      'funding.cap2to6': 15000,
      'funding.cap7plus': 8000,
    },
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [BEG_EM_RICHTLINIE, KFW_458_INFOBLATT],
    note: 'Ob die Degression nach 2028 weiterläuft, ist offen; angenommen wird: ja, ohne Ende.',
  },
]);
