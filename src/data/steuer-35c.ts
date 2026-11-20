import { defineFacts } from '../facts';
import { BEG_EM_RICHTLINIE, ESTG_35C, ESTG_52 } from './sources';

/** Steuerermäßigung für energetische Maßnahmen an selbstgenutzten Wohngebäuden. */
export const steuer35c = defineFacts([
  {
    id: 'estg35c-steuerermaessigung',
    topic: 'steuer-35c',
    title: '§ 35c EStG: Steuerermäßigung für energetische Maßnahmen',
    summary:
      '20 % der Kosten (höchstens 200.000 € Kosten, also höchstens 40.000 € Steuerermäßigung), verteilt auf 7 % im Jahr des Abschlusses, 7 % im Folgejahr und 6 % im zweiten Folgejahr. Nur für selbstgenutzte Gebäude, die mindestens 10 Jahre alt sind. Gilt für Maßnahmen, die nach dem 31.12.2019 begonnen und vor dem 01.01.2030 abgeschlossen sind. Mit der KfW-Förderung für dieselbe Maßnahme nicht kombinierbar (Richtlinie Nr. 8.6).',
    refs: {
      'tax.rateYear1': 0.07,
      'tax.rateYear2': 0.07,
      'tax.rateYear3': 0.06,
      'tax.maxBonus': 40000,
      'tax.maxCost': 200000,
      'tax.deadline': '2029-12',
      'tax.minBuildingAge': 10,
    },
    validUntil: '2029-12-31',
    status: 'bestaetigt',
    checkedAt: '2026-11-18',
    sources: [ESTG_35C, ESTG_52, BEG_EM_RICHTLINIE],
  },
]);
