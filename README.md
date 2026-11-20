# wpir-mcp

MCP-Server mit **Förderprogrammen und gesetzlichen Regelungen** rund um den Umstieg von Gas oder Öl auf eine Wärmepumpe (KfW 458, KfW 358/359, § 35c EStG, Darlehensrecht, CO₂-Preis, Gebäudemodernisierungsgesetz, Strom und Netz, Umsatzsteuer), jeweils mit Quelle, Prüfdatum und Status. Er ist die Wissensbasis, gegen die der [Wärmepumpen-Investitionsrechner](https://github.com/chkania/wpir) seine Standardwerte auf Aktualität prüfen lässt.

Öffentlich, nur lesend, zustandslos; keine Anmeldung, keine Nutzerdaten. Keine Rechts- oder Förderberatung – maßgeblich sind die verlinkten Originalquellen.

## Werkzeuge

| Werkzeug | Zweck |
|---|---|
| `list_topics` | Themen mit Anzahl der Fakten und ältestem Prüfdatum |
| `get_facts` | Fakten nach Thema, ID, Freitext oder Feldpfad des Rechners |
| `list_sources` | alle Quellen einmal, mit den Fakten, die sie belegen |
| `list_keys` | Feldpfade des Rechners, für die es einen Referenzwert gibt |
| `check_value` | Wert des Rechners (`key`, `value`) gegen den Referenzwert prüfen: `gleich`, `abweichend`, `unbekannt` |

Prozentwerte sind Anteile (0,3 = 30 %), Monate „JJJJ-MM“; Ausnahme ist `prices.bioSteps`, ein Text mit Prozentzahlen („2029:10, 2030:15, 2035:30, 2040:60“). Beispiel:

```json
{ "name": "check_value", "arguments": { "key": "funding.grundRate", "value": 0.25 } }
```

## Verbinden (Claude Code)

```bash
claude mcp add --transport http wpir-mcp https://mcp.wpir.de/mcp
```

Im Repo `wpir` steht die Verbindung in `.mcp.json`.

## Lokal entwickeln

```bash
npm install
npm test             # Tests (Datenqualität, Abfragen, SDK-Client, HTTP-Endpunkt)
npm run typecheck
npm run dev          # http://localhost:3000/mcp
```

## Bereitstellen bei Vercel

1. In Vercel **Add New → Project** und das Repo `chkania/wpir-mcp` importieren (Framework „Other“, keine Build- oder Output-Einstellungen nötig, keine Umgebungsvariablen).
2. Vercel erkennt `api/mcp.ts` als Funktion; `vercel.json` leitet `/mcp` dorthin.
3. Nach dem Deployment prüfen: `curl -s -X POST https://mcp.wpir.de/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`.
4. Die Domain `mcp.wpir.de` bei Vercel dem Projekt zuordnen (Settings → Domains, CNAME-Eintrag bei der Domain). Die URL steht in `.mcp.json` des Repos `wpir`; der Alias `wpir-mcp.vercel.app` funktioniert ebenfalls.

## Daten pflegen

Die Wissensbasis liegt unter `src/data/` (eine Datei je Thema). Jeder Fakt braucht Quelle, Prüfdatum und Status; siehe [CLAUDE.md](CLAUDE.md). Anforderungen: [docs/anforderungen/](docs/anforderungen/README.md). Mitarbeit: [CONTRIBUTING.md](CONTRIBUTING.md).

## Lizenz

PolyForm Noncommercial 1.0.0, siehe [LICENSE.md](LICENSE.md). Die Schriften Inter und JetBrains Mono unter `public/fonts/` stehen unter der SIL Open Font License 1.1 (Lizenztexte daneben).
