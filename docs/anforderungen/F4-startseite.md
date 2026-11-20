# F4 – Startseite

Wer die Adresse von wpir-mcp im Browser öffnet, sieht, was der Server liefert, welche fünf Werkzeuge er hat, wie man ihn anbindet und wo seine Grenzen liegen. Die Seite ist statisch (`public/index.html`), ohne Skript und ohne Nutzerdaten.

- F4.1 `public/index.html` ist statisches HTML mit eingebettetem CSS, ohne Build-Schritt und ohne Skript. Inter und JetBrains Mono per `@font-face` vom eigenen Host (`Inter Variable`, `JetBrains Mono Variable`, `font-display: swap`). Dateien: `public/fonts/inter-latin-wght-normal.woff2`, `public/fonts/jetbrains-mono-latin-wght-normal.woff2`; Lizenzen `public/fonts/LICENSE-Inter.txt`, `public/fonts/LICENSE-JetBrainsMono.txt` (OFL 1.1). Jede `font-family` endet auf `sans-serif` bzw. `monospace`. *(Test: homepage)*
- F4.2 Adresse `https://mcp.wpir.de/mcp`, Befehl `claude mcp add --transport http wpir-mcp https://mcp.wpir.de/mcp`; nur POST (Streamable HTTP), andere Methoden 405 (wie F1.3). Beispielaufruf `check_value` mit `funding.grundRate` und `0.25` wie in `README.md`, ohne Antwort. *(Test: homepage)*
- F4.3 Abschnitt `id="werkzeuge"`: `<dt><code>` je Werkzeug, Menge gleich den fünf Werkzeugen der Serverliste, je `<dd>` ein Satz Zweck wie F3.1–F3.5. *(Test: homepage; Satz im Code-Review)*
- F4.4 Abschnitt `id="themen"`: `<code>`-Inhalte sind genau die acht Themen-IDs aus `TOPICS` (F2.2), je einmal. Deutsche Bezeichnung daneben erlaubt. *(Test: homepage)*
- F4.5 Die Seite sagt: Jeder Fakt trägt Quelle, Prüfdatum und Status; maßgeblich sind die Originalquellen; „keine Rechts- oder Förderberatung“; öffentlich, „nur lesend“; „keine Nutzerdaten“ im Sinne von N1.3 (nur gesendete Feldpfade und Werte, ohne Speicherung oder Protokollierung). *(Test: homepage)*
- F4.6 Im sichtbaren Text kein Datum (`\b\d{4}-\d{2}\b`, `\b\d{1,2}\.\d{1,2}\.\d{4}\b`) und keine Zahl vor „Fakt…“ (`(?<![\w-])\d+\s+(?:[A-Za-zÄÖÜäöüß]+\s+)?Fakt`). Aktuelle Zahlen liefert `list_topics`. *(Test: homepage)*
- F4.7 Keine Nutzerdaten, kein Fremd-Host. Verboten: `<script`, `<form`, `<iframe`, `<object`, `<embed`, `javascript:`, `@import`, `prefers-color-scheme`, Ereignis-Attribute (`<[^>]*\son[a-z]+\s*=`), externe URL (`https?:` oder `//`) in `src`, `srcset`, `action`, `<link href>` oder CSS-`url(`. Externe Adressen nur in `<a href>` oder als Text. *(Test: homepage)*
- F4.8 Bei 400 px: `document.documentElement.scrollWidth <= 400`; lange Befehle und Adressen umbrechen oder scrollen im eigenen Block. *(Test: manuell in der Vercel-Vorschau)*
- F4.9 Immer dunkles Schema, kein Umschalter, keine `prefers-color-scheme`-Abfrage; `:root` mit `color-scheme: dark`. Farben nach Rechner-Variante „modern“ dunkel: Hintergrund `#17181b`, Fläche `#1d1f23`, Linie `#34363c`, Text `#ecebe7`, Hilfstext `#9a978d`, Akzent `#6fa3dc`. Kontrast mindestens 4,5:1 (nachgerechnet: mindestens 5,6:1). *(Test: homepage für Werte; Verwendung im Code-Review)*
- F4.10 `lang="de"`, Sie-Form (keine Du-Formen im sichtbaren Text). Lizenz „PolyForm Noncommercial 1.0.0“ mit Link `https://github.com/chkania/wpir-mcp/blob/main/LICENSE.md`. `<meta name="robots" content="noindex">` bleibt. *(Test: homepage)*
- F4.11 Genau ein Link `href="https://waermepumpen-investitionsrechner.de/"` (vom Nutzer bestätigt), in einem Satz, der sagt, wofür der Server dem Rechner dient; keine Werbeaussagen. *(Test: homepage für Link; Text im Code-Review)*

## Akzeptanzkriterien

- `tests/homepage.test.ts` liest `public/index.html` (Pfad über `import.meta.url` wie `tests/requirements-docs.test.ts`) und prüft F4.1 bis F4.11, außer F4.8. F4.3 gegen `createServer()` über `InMemoryTransport` wie in `tests/server.test.ts`; F4.4 gegen `TOPICS`.
- Manuell in der Vercel-Vorschau des PR: 400 px (`scrollWidth <= 400`); Schriften vom eigenen Host; `/mcp` im Browser liefert weiter 405.
- `npm test`, `npm run typecheck` und `tests/requirements-docs.test.ts` grün; F4 im Index.

## Annahmen

- Die Startseite ist ausdrücklicher Wunsch des Nutzers; sie ist statisch, nur lesend und ohne Nutzerdaten.
- Rechner-Link, Schriften im Repo, immer dunkles Schema, kein Skript und kein Analytics sind vom Nutzer entschieden.
- Schriften werden unverändert aus `@fontsource-variable/inter` und `@fontsource-variable/jetbrains-mono` (5.x, wie im Rechner) kopiert.
- Die Untermenge „latin“ enthält U+2082 („₂“) nicht. „CO₂“ fällt deshalb auf die Systemschrift zurück, wie im Rechner. Alle deutschen Zeichen sind enthalten.
- `noindex` bleibt. Domain `mcp.wpir.de` wie in `README.md`.
- Header aus `vercel.json` gelten auch für die statischen Dateien.
- `npm run dev` liefert nur `/mcp` aus; die Seite wird in der Vercel-Vorschau geprüft.

## Abgrenzung

- Kein Umschalter, kein Skript, kein Kopier-Button, kein Formular, kein Analytics, keine Cookies.
- Keine Google Fonts, keine externen Ressourcen.
- Keine JSON-Beispiele für alle Werkzeuge, keine Antwort zum Beispielaufruf, keine Angaben zu Faktenzahl oder Datenstand.
- Kein Haus-Logo, keine Preise, Marktdaten oder Berechnungshinweise.
- Keine Änderung an `/mcp`, `api/`, `src/`, `vercel.json`, `scripts/local-server.ts`, Daten oder Rechner-Repo.
