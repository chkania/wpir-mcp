/** Shared sources of the facts, so that URLs and labels are written down once. */
import type { FactInput } from '../facts.js';

type Source = FactInput['sources'][number];

/** Day the sources below were last read (taken over from the calculator's review of 2026-11-11). */
const READ = '2026-11-11';

/** Day the sources below were read (added with the legal values of 2026-11-20). */
const READ_2026_11_20 = '2026-11-20';

/** Day the KfW-Merkblätter 458 and 358/359 were read for the term and approval-period facts (F2.9, F2.10). */
const READ_2026_11_23 = '2026-11-23';

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

/** Same document as KFW_458_MERKBLATT, read on 2026-11-23 (F2.10). The label and URL are not repeated. */
export const KFW_458_MERKBLATT_2026_11_23: Source = { ...KFW_458_MERKBLATT, retrievedAt: READ_2026_11_23 };

/** Same document as KFW_358_359_MERKBLATT, read on 2026-11-23 (F2.9). The label and URL are not repeated. */
export const KFW_358_359_MERKBLATT_2026_11_23: Source = { ...KFW_358_359_MERKBLATT, retrievedAt: READ_2026_11_23 };

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

export const USTG_12: Source = {
  label: '§ 12 Abs. 1 UStG',
  url: 'https://www.gesetze-im-internet.de/ustg_1980/__12.html',
  retrievedAt: READ_2026_11_20,
};

export const BNETZA_EEG_FOERDERUNG: Source = {
  label: 'BNetzA „EEG-Förderung und -Fördersätze“ (§ 21 Abs. 1 i. V. m. §§ 48, 49, 53 Abs. 1 EEG 2023)',
  url: 'https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Foerderung/artikel.html',
  retrievedAt: READ_2026_11_20,
};

export const MSBG_30: Source = {
  label: '§ 30 Abs. 1 Nr. 4 und Abs. 2 MsbG',
  url: 'https://www.gesetze-im-internet.de/messbg/__30.html',
  retrievedAt: READ_2026_11_20,
};

export const BUNDESTAG_GMODG: Source = {
  label: 'Bundestag Textarchiv 2026 KW 28 (Heizungsgesetz)',
  url: 'https://www.bundestag.de/dokumente/textarchiv/2026/kw28-de-heizungsgesetz-1194534',
  retrievedAt: READ_2026_11_20,
};

export const BGBL_2026_226: Source = {
  label: 'BGBl. 2026 I Nr. 226 vom 28.07.2026',
  url: 'https://www.recht.bund.de/bgbl/1/2026/226/VO.html',
  retrievedAt: READ_2026_11_20,
};

export const BEHG_10: Source = {
  label: '§ 10 Abs. 2 Satz 4 BEHG',
  url: 'https://www.gesetze-im-internet.de/behg/__10.html',
  retrievedAt: READ_2026_11_20,
};

export const BUNDESTAG_BEHG_KW39: Source = {
  label: 'Bundestag Textarchiv 2026 KW 39 (Brennstoffemissionshandelsgesetz)',
  url: 'https://www.bundestag.de/dokumente/textarchiv/2026/kw39-de-brennstoffemissionshandelsgesetz-1211312',
  retrievedAt: READ_2026_11_20,
};

export const BNETZA_PARA_14A: Source = {
  label: 'BNetzA „Reduzierung des Netzentgelts“ (§ 14a EnWG)',
  url: 'https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/Netzentgelt_table.html',
  retrievedAt: READ_2026_11_20,
};
