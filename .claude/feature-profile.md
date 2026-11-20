# Feature profile

Projektprofil für das Plugin `chk-sdlc` (Format: `docs/PROFILE.md` im Repo `chkania/claude-chk-sdlc`).

## Project
wpir-mcp: öffentlicher, schreibgeschützter MCP-Server (Vercel) mit Wissensbasis zu Förderprogrammen und gesetzlichen Regelungen für den Wärmepumpen-Investitionsrechner (Repo `wpir`). Rahmen: `docs/anforderungen/` (Produktbeschreibung, falls vorhanden).

## Paths
- Anforderungen: docs/anforderungen/
- Prüfliste: .claude/requirements-checklist.md
- Laufbuch: .claude/feature-log.md
- Standard-Branch: main

## Commands
- Tests gezielt: `npx vitest run --reporter=dot <tests/datei.test.ts …>`
- Tests vollständig: `npm test -- --reporter=dot`
- Tests mit Abdeckung: `npm run test:coverage -- --reporter=dot`
- Build/Typprüfung: `npm run typecheck`
- Basis-Messung: keine

## Cleanup after test runs
keine

## Documentation duties (implementer)
- Anforderungen nach den Pflegeregeln in `docs/anforderungen/README.md`.
- Werkzeuge und Daten in der `README.md`.
- Änderung an Werkzeugnamen, Eingaben oder Ausgabeformat im Änderungsprotokoll nennen (relevant für den Rechner-Agenten im Repo wpir).
- Neue Fakten nur mit Quelle (URL, Lesedatum), Prüfdatum und Status (`src/facts.ts`); nichts erfinden, was nicht in einer genannten Quelle steht.
- Neue Werkzeuge über den SDK-Client (`tests/server.test.ts`) und über HTTP (`tests/http.test.ts`) testen.

## Review focus (code review)
- Korrekt: Abfragen bei Grenzfällen (leere Filter, unbekannter Feldpfad, Typen beim Vergleich); Fakten stimmen mit ihren Quellen überein und tragen Quelle, Prüfdatum und Status.
- Sicher: Server bleibt nur lesend, öffentlich und zustandslos; keine Nutzerdaten, keine Secrets, keine internen Fehlerdetails in der Ausgabe; Werkzeug-Eingaben mit `zod` begrenzt.
- Schnittstelle: Werkzeugnamen, Eingaben und Ausgabeformat bleiben abwärtskompatibel oder die Änderung ist ausdrücklich genannt (der Rechner-Agent im Repo wpir hängt daran).
- Struktur: Daten in `src/data`, reine Abfragen in `src/queries.ts`, Server in `src/mcp-server.ts`; Namen und Kommentare englisch, Nutzertexte deutsch.

## QA criteria
- Mindestabdeckung laut `vitest.config.ts`; neue Zeilen/Verzweigungen in `src/` und `api/` abgedeckt.
- Datenqualität: neue oder geänderte Fakten tragen Quelle, Prüfdatum und Status; Feldpfade eindeutig; `tests/data.test.ts` grün; Stichprobe der Zusammenfassung gegen die Quelle (wenn erreichbar).
- Schnittstelle und Sicherheit: Werkzeuge nur lesend; Änderungen an Namen, Eingaben oder Ausgabeformat in Anforderung und Änderungsprotokoll genannt; `tests/http.test.ts` grün (echter Endpunkt).
- Dokumentation: Anforderung, Änderungsprotokoll und `README.md` ergänzt.
