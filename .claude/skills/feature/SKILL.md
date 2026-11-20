---
name: feature
description: Neue Funktion von der Anforderung bis zum PR über die Agentenkette Anforderung → Anforderungs-Review → Implementierung → Code-Review → QA.
disable-model-invocation: true
---

Du steuerst die Agentenkette für die Eingabe des Nutzers (Argumente dieses Aufrufs). Subagenten können keine weiteren Agenten starten; jede Übergabe läuft über dich. Melde dem Nutzer nach jeder Stufe in ein bis zwei Sätzen, wo die Kette steht.

**Übergaben schlank halten:** Längere Texte (Anforderung, Berichte) legst du als Datei im Scratchpad ab und gibst dem Agenten den Pfad sowie Basis bzw. Zwischenstand mit – er kennt diese Unterhaltung nicht. Agenten mit mehreren Durchgängen setzt du per SendMessage fort, damit sie ihren Kontext behalten.

## 1. Branch und Basis

`git fetch origin`. Ist das Arbeitsverzeichnis sauber, neuen Branch `feat/<kurzname>` von `origin/main` anlegen. Sonst den Nutzer fragen, ob die offenen Änderungen dazugehören.
- Den Commit als **Basis** merken (`git rev-parse HEAD`).

## 2. Anforderung – `requirements-author`

Starte ihn mit der Eingabe des Nutzers im Wortlaut. Bei `STATUS: RÜCKFRAGEN`: die offenen Punkte per AskUserQuestion stellen und die Antworten per SendMessage an denselben Agenten geben. Wiederholen bis `STATUS: FERTIG`.

### Zwischenfreigabe durch den Nutzer

Bevor die Anforderung an den Reviewer geht, zeigst du dem Nutzer die „Kurzfassung“ des Autors (unverändert) und fragst per AskUserQuestion: „Anforderung so akzeptieren?“ (Optionen: akzeptieren / Änderungen nötig).
- **Akzeptiert:** weiter mit Schritt 3.
- **Änderungen:** Wünsche des Nutzers per SendMessage an denselben `requirements-author`; wieder bis `STATUS: FERTIG`, neue Kurzfassung, erneut fragen.

Ohne Zustimmung geht die Anforderung nicht an den Reviewer.

## 3. Anforderungs-Review – `requirements-reviewer`

Übergib die fertige Anforderung samt „Hinweise für das Review“ und den Entscheidungen des Nutzers. Rückfragen wie in Schritt 2 behandeln, danach per SendMessage an den Reviewer zurück. Ergebnis ist die **geprüfte Anforderung**.

### Freigabe durch den Nutzer

Lege die geprüfte Anforderung als Datei im Scratchpad ab und nenne dem Nutzer den vollständigen Pfad (er soll sie dort lesen können). Fasse sie in wenigen Zeilen zusammen: Ziel, IDs, Kernpunkte, Annahmen, was ausdrücklich nicht dazugehört. Frage per AskUserQuestion: „Anforderung freigeben?“ (Optionen: freigeben / Änderungen nötig).
- **Freigabe:** weiter mit Schritt 4.
- **Änderungen:** Wünsche des Nutzers per SendMessage an den `requirements-reviewer` (bei inhaltlicher Neuformulierung an den `requirements-author`), geänderte Fassung wieder als Datei ablegen und erneut zur Freigabe vorlegen.

Ohne ausdrückliche Freigabe beginnt die Implementierung nicht.

## 4. Implementierung – `implementer`

Nur nach der Freigabe aus Schritt 3. Übergib die freigegebene Anforderung. Nach jeder Runde des Implementierers einen lokalen **Zwischenstand** anlegen (`git add -A && git commit -q -m "chore: wip"`) und den Commit merken. So bekommen Code-Review und QA in späteren Durchgängen nur das Delta.

## 5. Code-Review – `code-reviewer`

Übergib die geprüfte Anforderung, den Bericht des Implementierers und die Basis (erster Durchgang) bzw. den zuletzt geprüften Zwischenstand (weitere Durchgänge).
- `STATUS: ÄNDERUNGEN` (hohe oder mittlere Befunde): an den `implementer`, Zwischenstand, neues Code-Review auf dem Delta. Nach zwei Durchgängen mit weiterhin hohen Befunden: anhalten und dem Nutzer die Befunde vorlegen.
- `STATUS: OK`: geringe Befunde **sammeln** und weiter zur QA.

## 6. QA – `qa`

Übergib die geprüfte Anforderung, die Basis und in weiteren Durchgängen den zuletzt geprüften Zwischenstand.
- `STATUS: MÄNGEL`: Mängel an den `implementer`, Zwischenstand, dann Schritt 5 (Delta) und 6 erneut. Nach drei Durchgängen ohne Freigabe: anhalten und dem Nutzer die Mängel vorlegen.
  - **Tests passen nicht zur Anforderung** (Kriterium 7): Beanstandet die QA Tests auch im zweiten Durchgang noch, halte sofort an. Lege dem Nutzer die beanstandeten Tests (`Datei:Name`), das betroffene Akzeptanzkriterium und die Begründung der QA vor und frage per AskUserQuestion, wie es weitergehen soll (z. B. Test anpassen lassen, Anforderung präzisieren, Test so akzeptieren, Abbruch). Warte auf seine Antwort, bevor du weitermachst.
- `STATUS: FREIGABE`: gesammelte geringe Befunde (aus Code-Review und QA) einmal gebündelt an den `implementer`, ohne erneutes Review; sein Abschluss muss `npm test` und `npm run build` grün melden.

## 7. Nach der Freigabe

1. **Laufbuch:** einen Abschnitt nach dem Muster in `.claude/feature-log.md` anhängen (Stufen mit Modell, Durchgängen, Tokens und Dauer aus den Abschluss-Meldungen; spät gefundene Befunde mit der Stufe, die sie hätte verhindern können; Rückfragen), höchstens 15 Zeilen.
2. Zwischenstände zusammenfassen: `git reset --soft <Basis>`, dann ein Commit nach Conventional Commits (inkl. Laufbuch), Beschreibung deutsch aus Nutzersicht (`CONTRIBUTING.md`).
3. Den Nutzer fragen, ob jetzt gepusht und der PR erstellt werden soll (Push nur auf seinen Wunsch). Bei Ja: pushen, PR mit Zusammenfassung, Ergebnisänderungen und QA-Tabelle erstellen.

Abschlussbericht an den Nutzer: geprüfte Anforderung (IDs), Durchgänge je Stufe, QA-Ergebnis, Commit bzw. PR-Link. Empfiehl `/feature-retro`, wenn eine Stufe in diesem Lauf drei oder mehr Durchgänge brauchte oder seit der letzten Retro im Laufbuch fünf Läufe vergangen sind.
