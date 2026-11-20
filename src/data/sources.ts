/** Shared sources of the facts, so that URLs and labels are written down once. */
import type { FactInput } from '../facts';

type Source = FactInput['sources'][number];

/** Day the sources below were last read (taken over from the calculator's review of 2026-11-11). */
const READ = '2026-11-11';

export const BEG_EM_RICHTLINIE: Source = {
  label: 'BEG-EM-Richtlinie vom 17.08.2026 (BAnz AT 27.08.2026 B1)',
  url: 'https://www.bundesanzeiger.de/pub/publication/jLXvW09kHTQoDINAdoC/content/jLXvW09kHTQoDINAdoC/BAnz%20AT%2027.08.2026%20B1.pdf?inline',
  retrievedAt: READ,
};

export const KFW_458_MERKBLATT: Source = {
  label: 'KfW-Merkblatt 458 (Stand 09/2026)',
  url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005131_M_458.pdf',
  retrievedAt: READ,
};

export const KFW_458_INFOBLATT: Source = {
  label: 'KfW-Infoblatt förderfähige Maßnahmen (Version 11.1, 11/2026)',
  url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000004863_Infoblatt_BEG_F%C3%B6rderf%C3%A4hige_Ma%C3%9Fnahmen.pdf',
  retrievedAt: READ,
};

export const KFW_358_359_MERKBLATT: Source = {
  label: 'KfW-Merkblatt 358/359 (Stand 09/2026)',
  url: 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005135_M_358_359.pdf',
  retrievedAt: READ,
};

export const KFW_358_359_SEITE: Source = {
  label: 'KfW 358/359 Produktseite (Zinsen dort nicht verfügbar)',
  url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Einzelma%C3%9Fnahmen-Erg%C3%A4nzungskredit-Wohngeb%C3%A4ude-(358-359)/',
  retrievedAt: READ,
};

export const ESTG_35C: Source = {
  label: '§ 35c EStG',
  url: 'https://www.gesetze-im-internet.de/estg/__35c.html',
  retrievedAt: READ,
};

export const BGB_500: Source = {
  label: '§ 500 BGB (vorzeitige Rückzahlung bei Verbraucherdarlehen)',
  url: 'https://www.gesetze-im-internet.de/bgb/__500.html',
  retrievedAt: READ,
};

export const ESTG_52: Source = {
  label: '§ 52 Abs. 35a EStG (Anwendungszeitraum)',
  url: 'https://www.gesetze-im-internet.de/estg/__52.html',
  retrievedAt: READ,
};

export const BGB_502: Source = {
  label: '§ 502 BGB (Vorfälligkeitsentschädigung bei Verbraucherdarlehen)',
  url: 'https://www.gesetze-im-internet.de/bgb/__502.html',
  retrievedAt: READ,
};
