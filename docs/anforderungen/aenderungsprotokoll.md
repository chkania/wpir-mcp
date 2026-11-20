# Änderungsprotokoll

Neue Einträge unten anfügen (Datum, betroffene IDs, Änderung). Änderungen an Werkzeugnamen, Eingaben oder Ausgabeformat ausdrücklich nennen, weil der Rechner-Agent im Repo wpir daran hängt.

| Datum | Änderung |
|---|---|
| 2026-11-20 | Erstfassung: MCP-Endpunkt (F1), Wissensbasis mit Förder- und Rechtsdaten des Rechners (F2), Werkzeuge `list_topics`, `get_facts`, `list_sources`, `list_keys`, `check_value` (F3), Rahmenbedingungen N1–N3 und Produktbeschreibung. |
| 2026-11-20 | N2.1a Behebung des fehlgeschlagenen Vercel-Deployments: relative Imports mit Endung `.js` (Node-ESM, Typecheck mit `NodeNext`), Ausgabeverzeichnis `public` mit Startseite. Werkzeuge und Daten unverändert. |
| 2026-11-20 | N2.1a Zweite Behebung des Vercel-Deployments (Build-Log): `@vercel/backends` stürzte mit TypeScript 7 ab (`ts.sys` fehlt) und erkannte `src/server.ts` als Server-Einstieg. TypeScript auf 5.9, Datei in `src/mcp-server.ts` umbenannt, `"framework": null`, `engines` `22.x`. Werkzeuge und Daten unverändert. |
