import { defineFacts } from '../facts.js';
import { BNETZA_EEG_FOERDERUNG, BNETZA_PARA_14A, MSBG_30 } from './sources.js';

/** Strom und Netz: Einspeisevergütung, Messstellenbetrieb (MsbG) und Netzentgelt-Pauschale (§ 14a EnWG). */
export const stromNetz = defineFacts([
  {
    id: 'eeg-teileinspeisung-bis-10-kwp',
    topic: 'strom-netz',
    title: 'EEG: Teileinspeisung bis 10 kW (Inbetriebnahme 2026)',
    summary:
      'Vergütung für Teileinspeisung bis 10 kW: 7,7 ct/kWh für Anlagen, die vom 01.08. bis 31.12.2026 in Betrieb gehen (Referenz `heatPump.feedInCt`, ct/kWh).',
    refs: { 'heatPump.feedInCt': 7.7 },
    validFrom: '2026-08-01',
    validUntil: '2026-12-31',
    status: 'bestaetigt',
    checkedAt: '2026-11-20',
    sources: [BNETZA_EEG_FOERDERUNG],
    note: 'Teileinspeisung bis 10 kW, Inbetriebnahme 01.08.–31.12.2026; maßgeblich ist der Satz bei Inbetriebnahme. Sekundärseiten nennen teils 31.01.2027. EEG-Novelle im Verfahren.',
  },
  {
    id: 'msbg30-preisobergrenze-imsys',
    topic: 'strom-netz',
    title: 'MsbG: Preisobergrenze für intelligente Messsysteme',
    summary:
      'Der Messstellenbetrieb eines intelligenten Messsystems ist nach § 30 Abs. 1 Nr. 4 MsbG auf insgesamt 130 € brutto je Jahr begrenzt, davon höchstens 80 € für den Anschlussnetzbetreiber und 50 € für den Anschlussnutzer. Referenz `heatPump.smartMeterFee` ist 100 €, die Summe der Kundenanteile (50 + 50).',
    refs: { 'heatPump.smartMeterFee': 100 },
    status: 'bestaetigt',
    checkedAt: '2026-11-20',
    sources: [MSBG_30],
    note: 'Höchstbetrag; niedrigere Entgelte zulässig, dann `abweichend`. Abs. 1 Nr. 4: insgesamt 130 € brutto jährlich, davon höchstens 80 € für den Anschlussnetzbetreiber und 50 € für den Anschlussnutzer. Abs. 2 erlaubt zusätzlich je bis zu 50 € für Einbau und Betrieb der Steuerungseinrichtung (Anschlussnehmer und Anschlussnetzbetreiber). Der Referenzwert 100 € (50 € Anschlussnutzer nach Abs. 1 Nr. 4 + 50 € Steuerungseinrichtung nach Abs. 2) ist der bewusst gewählte Vergleichswert des Rechners; höhere Beträge bis insgesamt 130 € sind gesetzlich möglich. Nr. 4 gilt für über 10.000 bis 20.000 kWh, steuerbare Verbrauchseinrichtung nach § 14a EnWG oder Anlagen über 7 bis 15 kW. Festlegung der BNetzA nach § 33 MsbG (Vorrang nach Abs. 6) nicht geprüft.',
  },
  {
    id: 'para14a-modul-1-regel',
    topic: 'strom-netz',
    title: '§ 14a EnWG: Pauschale Netzentgeltreduzierung (Modul 1)',
    summary:
      'Für steuerbare Verbrauchseinrichtungen (z. B. Wärmepumpe) gibt es nach § 14a EnWG eine Pauschale im Modul 1, deren Höhe je Netzgebiet verschieden ist. Das Rechnerfeld ist `heatPump.para14aReduction`.',
    refs: {},
    status: 'sekundaerquelle',
    checkedAt: '2026-11-20',
    sources: [BNETZA_PARA_14A],
    note: 'Pauschale je Netzgebiet verschieden, einmal je Marktlokation. BNetzA nennt 110–190 €/Jahr (Stand 2023, brutto/netto offen). Festlegung BK8-22/010-A nicht gelesen. Kein fester Vergleichswert.',
  },
]);
