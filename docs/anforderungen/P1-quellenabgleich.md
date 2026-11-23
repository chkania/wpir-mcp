# P1 – Quellenabgleich der Wissensbasis (Pflege-Agent)

Ziel: Der Projektinhaber lässt die Fakten der Wissensbasis gegen ihre aktuellen Quellen prüfen. Das umfasst Förderbedingungen, Rechtsgrundlagen, Preise und Marktdaten, einschließlich Energie- und Zinsmärkte. So erkennt er Änderungen früh und findet fehlende Regeln. Der Agent zeigt zuerst eine Vergleichstabelle und eine Vorschlagsliste. Erst nach ausdrücklicher Bestätigung formuliert er die bestätigten Punkte als Anforderungstext, den der Nutzer an `/chk-sdlc:feature` übergibt.

IDs: P1 (neu, neue Kategorie „Pflege“), Unterpunkte P1.1–P1.11. Datei `docs/anforderungen/P1-quellenabgleich.md`. F1–F4 und N1–N3 bleiben inhaltlich unverändert. Geändert werden die Produktbeschreibung (Rahmen) und der Dokumententest zu N3.3.

## Anforderungen
- P1.1 Der Agent ist der Projekt-Subagent `source-check` (`.claude/agents/source-check.md`). Er läuft in eigenem Kontext, wird manuell im Repo `wpir-mcp` gestartet, gehört nicht zum Server und hat keinen Zeitplan. Ablauf:
  - (a) Der erste Lauf gibt Tabelle (P1.4) und Vorschlagsliste (P1.5) an den Hauptkontext zurück und endet.
  - (b) Der Hauptkontext zeigt beides unverändert. Der Nutzer bestätigt ausdrücklich, welche Zeilen und Vorschläge übernommen werden: alle, eine Auswahl oder keine.
  - (c) Der Hauptkontext übergibt nur die bestätigten Punkte an den Agenten, fortgesetzt per `SendMessage` oder neu gestartet. Der Agent liefert dann den Anforderungstext (P1.8).
  *(Test: manuell, Probelauf)*
- P1.2 Der Agent liest alle Fakten aus `src/data/` und je Fakt die Quellen (Label, URL). Er vergleicht nur mit den Quellen, die am Fakt stehen. Eine nicht abrufbare oder nicht lesbare Quelle (HTTP-Fehler, PDF ohne lesbaren Text) wird als `nicht prüfbar` mit Grund gemeldet und nicht übersprungen. *(Test: manuell, Probelauf)*
- P1.3 Je Fakt vergleicht der Agent mit den Quellen:
  - jeden Referenzwert (`refs`, Feldpfad),
  - die Gültigkeit (`validFrom`, `validUntil`),
  - die Zusammenfassung `summary`, und zwar inhaltlich: `Formulierung geändert` gilt nur, wenn die `summary` dem Inhalt der Quelle nicht mehr entspricht (Zahl, Datum, Begriff, Bedingung). Reine Umformulierungen ohne inhaltliche Änderung gelten als `unverändert`. Bei `Formulierung geändert` zeigt er den alten Wortlaut (`summary` im Bestand) und einen neuen Wortlaut als Vorschlag nach der Quelle.

  Status und Prüfdatum werden angezeigt, aber nicht verglichen. *(Test: manuell, Probelauf)*
- P1.4 Vergleichstabelle: eine Zeile je Fakt und Feld. Feld ist ein Feldpfad aus `refs`, `validFrom` oder `validUntil`, wenn der Bestand oder die Quelle das Datum nennt, und `summary`, das jeder Fakt hat. Spalten:
  - Fakt-ID, Feld, Bestandswert, Quellwert,
  - Ergebnis: bei Werten und Daten `gleich`, `abweichend` oder `nicht prüfbar`; bei `summary` `unverändert`, `Formulierung geändert` oder `nicht prüfbar`,
  - Quelle (URL), Lesedatum (Tag des Laufs), Prüfdatum (`checkedAt` im Bestand), Status (im Bestand).

  Hat ein Fakt mehrere Quellen und nennen sie verschiedene Werte, steht je Quelle eine Zeile. Preis- und Marktdaten stehen in derselben Tabelle wie alle anderen Fakten. *(Test: manuell, Probelauf)*
- P1.5 Der Agent sucht aktiv nach neuen Förderprogrammen, Rechtsregeln, Preisen und Marktdaten in diesen Themen: Wärmepumpe, Gas-/Ölumstieg, Förderung, Steuer, Darlehen, CO₂-Preis, Gebäudemodernisierung, Strom und Netz, Umsatzsteuer, Energie- und Zinsmärkte. Die Treffer kommen in eine eigene Vorschlagsliste, getrennt von der Tabelle.
  - Höchstens zehn Vorschläge je Lauf.
  - Was schon ein Fakt oder Feldpfad im Bestand abdeckt, ist kein Vorschlag.
  - Jeder Vorschlag hat Titel, Quelle (URL), Lesedatum, Status (`bestaetigt` bei amtlicher Quelle, sonst `sekundaerquelle`) und den Vermerk „unbestätigt“.
  - Ohne Treffer steht dort „keine Vorschläge“.

  *(Test: manuell, Probelauf)*
- P1.6 Vorschläge erzeugen weder Fakten noch Tabellenzeilen. Bestätigte Vorschläge kommen als Punkte „neuer Fakt“ in den Anforderungstext (P1.8). Ein neuer Fakt entsteht erst, wenn dieser Text durch einen Lauf von `/chk-sdlc:feature` umgesetzt ist. Dort werden Quelle, Prüfdatum und Status nach CLAUDE.md erneut geprüft. *(Test: manuell, Probelauf)*
- P1.7 Der Agent nimmt nie eine Datei- oder Git-Aktion vor, weder vor noch nach der Bestätigung. Das ist durch P1.9 technisch abgesichert. *(Test: manuell, Git-Status vor und nach dem Probelauf; source-check-agent)*
- P1.8 Ohne ausdrückliche Bestätigung entsteht kein Anforderungstext. Nach der Bestätigung gibt der Agent die bestätigten Punkte im Chat als Anforderungstext im Format von `.claude/requirements-checklist.md` aus. Bestätigt werden können Zeilen mit `abweichend` oder `Formulierung geändert` und Vorschläge.
  - Gliederung: Titel, Ziel, IDs (Hinweis: „vergibt `/chk-sdlc:feature`“), Anforderungen, Akzeptanzkriterien, Betroffene Bereiche, Annahmen, Abgrenzung, Offene Punkte.
  - Abweichungen nennen Fakt-ID, alten und neuen Wert bzw. Wortlaut, Quelle (URL), Lesedatum und Status.
  - Bestätigte Vorschläge stehen als eigene Punkte „neuer Fakt“ mit Titel, Quelle (URL), Lesedatum und Status. Dazu kommt der Hinweis, dass `/chk-sdlc:feature` Quelle und Status erneut prüft.
  - Der Nutzer übergibt den Text an `/chk-sdlc:feature`.

  *(Test: manuell, Probelauf)*
- P1.9 Das Frontmatter der Agentendatei enthält das Feld `tools`. Es nennt nur Werkzeuge aus der Positivliste `Read`, `Grep`, `Glob`, `WebFetch`, `WebSearch`. Das Feld `mcpServers` fehlt. Ohne `tools` würde der Agent alle Werkzeuge erben, auch MCP-Werkzeuge mit Schreibzugriff. *(Test: source-check-agent)*
- P1.10 Jede Tabellenzeile, jeder Vorschlag und jeder Punkt im Anforderungstext nennen Quelle (https-URL), Lesedatum des Laufs (JJJJ-MM-TT) und Status. Tabellenzeilen nennen zusätzlich das Prüfdatum. Bei Vorschlägen entfällt es, weil es keinen Bestand gibt. Ein Fakt oder Vorschlag mit Status `sekundaerquelle` ist in der Spalte Status bzw. am Vorschlag sichtbar als „Sekundärquelle“ gekennzeichnet. Das gilt auch für Abweichungen aus solchen Fakten. *(Test: manuell, Probelauf)*
- P1.11 Die Rahmenregel wird geändert: Preis- und Marktdaten, einschließlich Energie- und Zinsmärkten, dürfen in die Wissensbasis. Sie brauchen dieselben Pflichtfelder wie jeder Fakt: Quelle mit URL und Lesedatum, Prüfdatum, Status. Sekundärquellen sind zugelassen, wenn sie als `sekundaerquelle` gekennzeichnet sind. Geändert werden:
  - in `docs/anforderungen/produktbeschreibung.md` der Abschnitt „Zweck“ (Themen um Preis- und Marktdaten ergänzt), der Abschnitt „Was wpir-mcp nicht ist“ (Eintrag „Keine Preis- und Marktdaten“ entfällt) und die Leitplanke „Kein Widerspruch“ („keine Marktdaten“ entfällt),
  - in `CLAUDE.md` der Abschnitt „Daten pflegen“ (Satz „Preise und Marktdaten gehören nicht hinein“ wird durch die neue Regel ersetzt).

  Diese Anforderung legt selbst keine neuen Themen oder Fakten an. *(Test: requirements-docs)*

## Akzeptanzkriterien
- Nach einem vollständigen Probelauf mit erstem Lauf, Bestätigung und Anforderungstext ist `git status --porcelain` gleich wie vorher.
- Probelauf mit `funding.grundRate` im Arbeitsverzeichnis vorübergehend auf 0.25 (Fakt `kfw458-grundfoerderung`, Quelle nennt 30 %): Die Zeile zeigt Bestandswert 0.25, Quellwert 0.3 und `abweichend`. Mit dem echten Bestand 0.3 zeigt sie `gleich`. Danach wird die Änderung zurückgesetzt.
- Probelauf mit `summary` von `kfw458-grundfoerderung` vorübergehend auf „Grundförderung von 25 % der förderfähigen Kosten …“: Die Zeile `summary` zeigt `Formulierung geändert` mit altem Wortlaut (Bestand) und neuem Wortlaut (nach Quelle, „30 %“). Mit dem echten Bestand zeigt sie `unverändert`.
- Probelauf mit derselben `summary`, nur umformuliert und ohne inhaltliche Änderung (z. B. „Die Grundförderung beträgt 30 % der förderfähigen Kosten; maßgeblich ist der Antragsmonat.“): Die Zeile zeigt `unverändert`.
- Der Preisfakt `eeg-teileinspeisung-bis-10-kwp` (`heatPump.feedInCt` = 7.7) und der Marktfakt `kfw358-359-zinssaetze` (`financing.kfwRate358` = 0.022, `financing.kfwRate359` = 0.046) stehen in derselben Tabelle wie die übrigen Fakten. Jede Zeile hat Quelle, Lesedatum, Prüfdatum und Status.
- `kfw358-359-zinssaetze` ist in der Spalte Status als „Sekundärquelle“ gekennzeichnet und trägt die https-URL.
- Die Fakten ohne Referenzwert `behg-co2-preiskorridor-2026` und `para14a-modul-1-regel` erscheinen mit mindestens der Zeile `summary`.
- Eine nicht abrufbare Quelle (HTTP-Fehler) oder ein PDF ohne lesbaren Text führt zu `nicht prüfbar` mit Grund, nie zu `gleich` oder `unverändert`.
- Jede Tabellenzeile hat eine https-URL und ein Lesedatum im Format JJJJ-MM-TT, das dem Tag des Laufs entspricht.
- Die Vorschlagsliste steht getrennt von der Tabelle. Sie hat höchstens zehn Einträge, jeder mit „unbestätigt“, URL, Lesedatum und Status. Ohne Treffer steht dort „keine Vorschläge“. Kein Vorschlag betrifft einen Feldpfad oder Fakt, den es im Bestand schon gibt.
- Ohne Bestätigung kommt kein Anforderungstext. Bestätigt der Nutzer „keine“, endet der Ablauf ohne Text.
- Der Anforderungstext nach Bestätigung hat die Abschnitte Titel, Ziel, IDs, Anforderungen, Akzeptanzkriterien, Betroffene Bereiche, Annahmen, Abgrenzung und Offene Punkte. Er nennt die Fakt-IDs aller bestätigten Zeilen und keine unbestätigte. Jeder bestätigte Vorschlag steht als Punkt „neuer Fakt“ mit Quelle, Lesedatum und Status darin. Er erscheint im Chat, nicht als Datei.
- `tests/source-check-agent.test.ts` schlägt fehl, wenn eine dieser Bedingungen zutrifft:
  - `.claude/agents/source-check.md` fehlt,
  - `name` ist nicht `source-check`,
  - `tools` fehlt,
  - `tools` enthält ein Werkzeug außerhalb von `Read`, `Grep`, `Glob`, `WebFetch`, `WebSearch` (z. B. `Write`, `Edit`, `Bash`, `NotebookEdit`, `Agent`, `mcp__…`),
  - `mcpServers` steht im Frontmatter.
- `tests/requirements-docs.test.ts` erkennt Dateien mit `P`-Präfix. Der Index verlinkt `P1-quellenabgleich.md`, die Unterpunkte tragen die ID P1, und der Test bleibt grün.
- `tests/requirements-docs.test.ts` prüft für P1.11 (Textprüfung):
  - `produktbeschreibung.md` enthält weder „Keine Preis- und Marktdaten“ noch „keine Marktdaten“,
  - `CLAUDE.md` enthält nicht „Preise und Marktdaten gehören nicht hinein“,
  - beide Dateien enthalten einen Satz mit „Preis- und Marktdaten“, der Quelle, Prüfdatum und Status verlangt.
- `npm test` und `npm run typecheck` sind grün. Die Abdeckung von `src/` bleibt unverändert, weil sich dort nichts ändert.

## Betroffene Bereiche
- `.claude/agents/source-check.md` (neu): Frontmatter mit `name`, `description`, `tools` (Positivliste P1.9), danach die Anweisung. Die Ausgaben sind deutsch.
- `tests/source-check-agent.test.ts` (neu): prüft das Frontmatter (P1.9).
- `tests/requirements-docs.test.ts`: Präfix `P` in den Mustern für Dateinamen, Unterpunkte und Indexlinks (heute nur `[FN]`); Textprüfung für P1.11.
- `docs/anforderungen/README.md`: neuer Abschnitt „Pflege“ mit Tabelle und Zeile für P1.
- `docs/anforderungen/P1-quellenabgleich.md` (neu): diese Anforderung. Unterpunkte als `- P1.x ` ohne Fettdruck, damit das Muster des Dokumententests greift.
- `docs/anforderungen/produktbeschreibung.md`: die Abschnitte „Zweck“ und „Was wpir-mcp nicht ist“ und die Leitplanke „Kein Widerspruch“ (P1.11).
- `CLAUDE.md`, Abschnitt „Daten pflegen“: neue Regel (P1.11) und ein Satz zum Agenten `source-check`.
- `README.md`, Abschnitt „Daten pflegen“: Hinweis auf den Agenten `source-check` und den Ablauf mit Bestätigung.
- `docs/anforderungen/aenderungsprotokoll.md`: Eintrag mit Datum. P1 neu, Produktbeschreibung und CLAUDE.md geändert (Preis- und Marktdaten zugelassen), Dokumententest um Präfix P erweitert. Werkzeugnamen, Eingaben, Ausgabeformat und Daten des Servers sind unverändert, der Rechner-Agent in wpir ist nicht betroffen.
- Commit-Typ: `feat:` (neue Pflegefunktion), Beschreibung deutsch.

## Annahmen
- Projekt-Subagenten liegen in `.claude/agents/`. Ohne Feld `tools` erben sie alle Werkzeuge einschließlich MCP-Werkzeugen. `AskUserQuestion` steht ihnen nicht zur Verfügung; sie geben ein Ergebnis an den Hauptkontext zurück. Ein beendeter Subagent lässt sich per `SendMessage` fortsetzen. Quelle: https://code.claude.com/docs/en/subagents, abgerufen 2026-11-23.
- Quellen für den Abgleich sind die URLs am Fakt bzw. in `src/data/sources.ts`.
- Für Preise und Marktdaten sind amtliche Quellen und Sekundärquellen zugelassen. Sekundärquellen werden mit Status `sekundaerquelle` und URL gekennzeichnet; weitere Einschränkungen gibt es nicht (Festlegung des Nutzers).
- Höchstens zehn Vorschläge je Lauf (Festlegung des Nutzers).
- Der `summary`-Abgleich ist inhaltlich, nicht wörtlich, weil die Wissensbasis keinen Wortlaut der Quelle speichert (Festlegung des Nutzers).
- Bestätigte Vorschläge gehen als „neuer Fakt“ in den Anforderungstext (Festlegung des Nutzers).
- Lesedatum ist der Tag des Laufs. Prüfdatum und Status im Bestand ändern sich erst über eine Anforderung, nicht durch den Agenten.
- Den Status gibt es am Fakt (`src/facts.ts`), nicht an der einzelnen Quelle. „Sekundärquelle“ wird deshalb am Fakt bzw. Vorschlag gekennzeichnet.
- Die Ergebnisbegriffe für Werte folgen `check_value` (`gleich`, `abweichend`) und werden um `nicht prüfbar` ergänzt.
- Sprache: Ausgaben und Anforderungstexte deutsch, Dateinamen, Frontmatter-Namen und Code englisch.
- Der Bestand enthält schon Preisbezüge: `heatPump.feedInCt` = 7.7, `heatPump.smartMeterFee` = 100, die KfW-Zinssätze als Sekundärquelle (F2.5, F2.6). P1.11 gleicht die Regel an den Bestand an.
- Die Verhaltensanforderungen des Agenten (P1.1–P1.8, P1.10) lassen sich nicht automatisch testen. Sie werden in einem manuellen Probelauf vor dem PR geprüft; die Stichprobe gegen die Originale macht der Projektinhaber.

## Abgrenzung
- Kein Abruf durch den Server, kein Zeitplan, keine Hintergrundprüfung. N1 und „Keine automatische Aktualisierung“ der Produktbeschreibung bleiben gültig.
- Der Agent legt keine Fakten an, ändert keine Dateien oder Daten und macht keine Commits oder PRs. Die Umsetzung läuft über `/chk-sdlc:feature`.
- Unbestätigte Vorschläge erscheinen nirgends außer in der Vorschlagsliste: keine Tabellenzeile, kein Eintrag in `src/data/`, nicht im Anforderungstext.
- Kein wörtlicher Abgleich mit der Quelle und kein gespeichertes Zitat am Fakt. F2.1 und das Datenmodell bleiben unverändert.
- Diese Anforderung bringt keine neuen Themen (`TOPICS`) und keine neuen Fakten zu Preis- oder Marktdaten. Das bleibt jeweils einer eigenen Anforderung vorbehalten.
- `README.md` (Einleitung), `public/index.html` und F4 bleiben unverändert. F4 schließt Preise und Marktdaten nur auf der Startseite aus, nicht in der Wissensbasis.
- Kein Abgleich mit dem Rechner (wpir) und seinen Standardwerten; das bleibt beim Rechner-Agenten.
- Keine rechtliche Bewertung von Abweichungen. Der Agent meldet sie, der Projektinhaber entscheidet.
- Keine Berechnung und kein Rechenkern.
- Server (`src/`, `api/`) betrifft nicht.

## Offene Punkte
keine
