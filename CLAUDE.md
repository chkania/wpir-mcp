# wpir-mcp

MCP-Server (Streamable HTTP, zustandslos, nur lesend) auf Vercel mit Förderprogrammen und gesetzlichen Regelungen für den Wärmepumpen-Investitionsrechner (Repo `chkania/wpir`). Der Rechner-Agent dort prüft seine Standardwerte damit auf Aktualität.

## Vor jeder Änderung
1. `docs/anforderungen/produktbeschreibung.md` (Rahmen) und `docs/anforderungen/README.md` (Index) lesen, dazu die betroffenen Anforderungsdateien.
2. `npm test` und `npm run typecheck` müssen vorher und nachher grün sein.
3. Neue/geänderte Anforderung → Pflegeregeln in `docs/anforderungen/README.md` befolgen (Datei, Index, Test-Verweis, Änderungsprotokoll) und Test ergänzen. Werkzeuge und Daten stehen in der `README.md`.
4. Änderungen an Werkzeugnamen, Eingaben oder Ausgabeformat sind für den Rechner-Agenten in `wpir` relevant: im Änderungsprotokoll nennen und im Rechner-Repo mitziehen.

## Struktur
- `api/mcp.ts` – Vercel-Funktion, ein Server je Anfrage (`vercel.json` leitet `/mcp` dorthin).
- `src/mcp-server.ts` – Werkzeuge (`list_topics`, `get_facts`, `list_sources`, `list_keys`, `check_value`); `src/queries.ts` – reine Abfragen ohne MCP; `src/facts.ts` – Datenmodell mit `zod`.
- `src/data/` – die Wissensbasis, eine Datei je Thema, gemeinsame Quellen in `sources.ts`. Neues Thema → Datei, Eintrag in `src/data/index.ts` und in `TOPICS` (`src/facts.ts`).
- `scripts/local-server.ts` – `npm run dev` (http://localhost:3000/mcp).
- `tests/` – Vitest; `server.test.ts` (SDK-Client), `http.test.ts` (echter Endpunkt), `data.test.ts` (Datenqualität).

## Vercel-Besonderheiten
- **TypeScript bleibt bei 5.9** (`~5.9.3`): Der Vercel-Builder liest `ts.sys`, das es in TypeScript 7 nicht gibt; mit 7 bricht der Build ab.
- **Dateinamen:** Keine Datei `src/server.ts`, `src/index.ts`, `server.ts` o. Ä. anlegen – Vercel hält sie für den Einstiegspunkt einer Server-App und wählt den falschen Builder (deshalb heißt die Datei `src/mcp-server.ts`, zusätzlich `"framework": null` in `vercel.json`).
- **Imports** relativ mit Endung `.js` (Node-ESM; der Typecheck mit `NodeNext` erzwingt das).

## Daten pflegen
Jeder Fakt braucht Quelle (URL, Lesedatum), Prüfdatum und Status; Referenzwerte tragen den Feldpfad des Rechners (`funding.grundRate`), Prozent als Anteil, Monate „JJJJ-MM“. Nichts ohne Quelle eintragen, Unsicheres als `note`. Preise und Marktdaten gehören nicht hinein.

## Agentenkette
`/feature <Beschreibung>` führt von der Anforderung bis zum PR (Agenten in `.claude/agents/`, Prüfliste `.claude/requirements-checklist.md`, Laufbuch `.claude/feature-log.md`); `/feature-retro` wertet das Laufbuch aus. Die allgemeinen Agenten sind Kopien aus dem Repo `wpir`; Verbesserungen dort bitte hier nachziehen und umgekehrt.

## Konventionen
- Code, Kommentare, Namen von Typen/Funktionen/Dateien: **Englisch**. Texte für Nutzer (Werkzeug-Beschreibungen, Fakten, Dokumentation, Commit-Beschreibung) **Deutsch**.
- Commit-Nachrichten nach Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `ci:` …), Beschreibung deutsch.
- Sicherheit: nur lesend, keine Secrets, keine Protokollierung von Anfrageinhalten, Eingaben der Werkzeuge mit `zod` begrenzen.
- Commit, Push und PR nur auf Wunsch.

## Befehle
`npm test` · `npm run test:coverage` (Mindestwerte in `vitest.config.ts`: 90 % Zeilen / 80 % Verzweigungen, nach oben nachziehen, nie senken) · `npm run typecheck` · `npm run dev`
