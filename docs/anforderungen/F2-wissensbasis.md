# F2 – Wissensbasis

- F2.1 Ein Fakt hat: stabile `id`, `topic`, `title`, `summary` (Regel in ein bis zwei Sätzen, Deutsch), `refs` (Referenzwerte je Feldpfad des Rechners), optional `validFrom`/`validUntil`, `status` (bestätigt, Sekundärquelle, Annahme), `checkedAt` (Prüfdatum), mindestens eine Quelle (Label, https-URL, Lesedatum) und optional `note` für offene Punkte. Die Form wird mit `zod` beim Laden geprüft; ein ungültiger Fakt verhindert den Start und nennt seine ID. *(Test: data)*
- F2.2 Themen: `foerderung-kfw-458`, `kredit-kfw-358-359`, `steuer-35c`, `darlehensrecht`; jedes hat mindestens einen Fakt. *(Test: data)*
- F2.3 IDs sind eindeutig, jeder Feldpfad gehört zu genau einem Fakt und hat die Form `bereich.feld` (z. B. `funding.grundRate`); Prozentwerte sind Anteile (0,3), Monate „JJJJ-MM“. *(Test: data)*
- F2.4 Das Lesedatum einer Quelle liegt nicht nach dem Prüfdatum des Fakts; `validFrom` liegt nicht nach `validUntil`. *(Test: data)*
- F2.5 Die Daten liegen als typisierte Dateien unter `src/data/` (eine je Thema, gemeinsame Quellen in `sources.ts`) und werden mit dem Server ausgeliefert. Ausgangsbasis sind die Förder- und Rechtswerte des Rechners (Stand der Prüfung 2026-11-18); Zinssätze der KfW-Kredite sind als Sekundärquelle gekennzeichnet. *(Test: data)*
