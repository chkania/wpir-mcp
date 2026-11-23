# wpir-mcp – Anforderungen

Verbindliche Sammlung der Anforderungen, eine Datei je Anforderung (mit ihren Unterpunkten, z. B. F3.1–F3.6). Bei jeder Änderung mitpflegen:

- **Neue Anforderung:** nächste freie ID, neue Datei `<ID>-<kurztitel>.md` (Überschrift `# <ID> – <Titel>`), Zeile in der Tabelle unten, Eintrag im [Änderungsprotokoll](aenderungsprotokoll.md).
- **Neuer Unterpunkt oder geänderter Text:** in der Datei der Anforderung, dazu ein Eintrag im Änderungsprotokoll.
- Jeder Unterpunkt nennt die Tests, die ihn absichern (*(Test: …)*).

## Ziel

Zweck, Benutzer, Grundentscheidungen und Abgrenzung stehen in der [Produktbeschreibung](produktbeschreibung.md).

## Weitere Dokumente

- [Produktbeschreibung](produktbeschreibung.md): der Rahmen für jede neue Anforderung
- [Änderungsprotokoll](aenderungsprotokoll.md)

## Funktionale Anforderungen

| ID | Titel |
|---|---|
| [F1](F1-mcp-endpunkt.md) | MCP-Endpunkt |
| [F2](F2-wissensbasis.md) | Wissensbasis |
| [F3](F3-werkzeuge.md) | Werkzeuge |
| [F4](F4-startseite.md) | Startseite |

## Nicht-funktionale Anforderungen

| ID | Titel |
|---|---|
| [N1](N1-nur-lesend-oeffentlich.md) | Nur lesend, öffentlich, ohne Nutzerdaten |
| [N2](N2-betrieb-auf-vercel.md) | Betrieb auf Vercel |
| [N3](N3-qualitaet.md) | Qualität |

## Pflege

Anforderungen an die Pflege der Wissensbasis (Präfix `P`): Sie beschreiben Werkzeuge für den Projektinhaber, nicht den Server.

| ID | Titel |
|---|---|
| [P1](P1-quellenabgleich.md) | Quellenabgleich der Wissensbasis (Pflege-Agent `source-check`) |
