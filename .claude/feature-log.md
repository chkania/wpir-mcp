# Laufbuch der Agentenkette `/chk-sdlc:feature`

Je Lauf ein Abschnitt, neueste unten. Der Skill `chk-sdlc:feature` hängt ihn nach Schritt 7 an; `/chk-sdlc:retro` wertet das Laufbuch aus. Tokens und Dauer aus den Abschluss-Meldungen der Agenten (Summe aller Durchgänge), gerundet.

Felder:
- **Stufen:** je Stufe Modell, Durchgänge, Tokens, Dauer.
- **Spät gefunden:** Befunde, die erst in einer späteren Stufe auffielen – mit der Stufe, die sie hätte verhindern können.
- **Nutzer:** Rückfragen und Eingriffe.
- **Notiz:** Besonderheiten des Laufs.

## 2026-11-20 – Rechtswerte des Rechners (F2.2, F2.3, F2.6–F2.8)
- **Stufen (alle Sonnet 5.5):** Autor 2 Durchgänge (~315k Tokens, ~6 min); Reviewer 1 (~80k, ~5 min); Implementierer 3 (~290k, ~6 min); Code-Review 2 (~73k, ~0,5 min); QA 2 (~95k, ~1 min).
- **Spät gefunden:** MsbG-Summary stellte 100 € als Gesamtgrenze dar (laut § 30 insgesamt 130 €, davon 80 € Netzbetreiber) – QA, hätte vom Autor/Reviewer (Quelle im Wortlaut lesen) verhindert werden können. list_keys-Test prüfte nur toContain statt Menge, F2.7-Test ohne Gültigkeitsprüfung – QA (Kriterium 7), hätte der Implementierer an den Akzeptanzkriterien erkennen können.
- **Früh gefunden (Reviewer):** ID-Kollision F2.6 (Test auf eindeutige IDs), CO₂-Korridor 2027 inzwischen vom Bundestag beschlossen, drei fehlende Dateien in der Bereichsliste.
- **Nutzer:** 5 Rückfragen (CO₂-Pfad, bioSteps-Format, § 14a, MsbG-Höchstwert, Themenzuschnitt), 2 Freigaben.
- **Notiz:** Bash-Aufrufe liefen über einen umschreibenden Hook (rtk), Wiederholung nötig. Quellen teils nur über Zusammenfassungen gelesen; Bio-Treppe bleibt `sekundaerquelle`.

## 2026-11-20 – Startseite mit MCP-Beschreibung (F4)
- **Stufen (Anforderung Sonnet 5.5, Rest Sonnet 5.5):** Autor 3 Durchgänge (~280k Tokens, ~5 min, zuletzt Dateiablage per Orchestrator nötig); Reviewer 1 (~62k, ~4 min); Implementierer 2 (~127k, ~3 min); Code-Review 1 (~34k, ~0,5 min); QA 1 (~28k, ~0,5 min).
- **Spät gefunden:** Der Autor hatte das Schreibwerkzeug nicht; die Datei musste der Orchestrator anlegen. Der Reviewer fand, dass die Schrift-Untermenge „latin“ das Zeichen ₂ nicht enthält (CO₂-Fallback) und dass F4.6/F4.7-Muster Fehltreffer lieferten. Hätte der Autor mit Schriftauszug und Mustertest verhindern können.
- **Nutzer:** 2 Rückfragerunden (Rechner-Link, Schrift, Dunkelmodus; Adresse, „nur dunkel“ präzisiert), 2 Freigaben. Die Beispielseite nur als Gliederung, nicht kopiert.
- **Notiz:** Der Lauf für Vercel Analytics wurde vom Nutzer verworfen (Branch feat/vercel-analytics ohne Commit, lokal). F4.8 (400 px) und Browser-Teil nur manuell in der Vorschau prüfbar.

## 2026-11-20 – Laufzeit auf Node 26.x (N2.1, N2.1a, N2.3)
- **Stufen (Autor, Reviewer, Implementierer, Code-Review, QA):** Autor 1 Durchgang (~57k Tokens, ~1,5 min); Reviewer 1 (~50k, ~2 min); Implementierer 2 (~82k + Nachbesserung, ~1,5 min); Code-Review 1 (~21k, ~0,3 min); QA 1 (~20k, ~0,4 min).
- **Spät gefunden:** Der Autor-Entwurf kürzte N2.1, N2.1a und N2.3 und gab einen Vercel-Vorbehalt an, den die offizielle Doku widerlegt. Der Reviewer hat beides korrigiert. Der Lockfile-Widerspruch (`>=22` gegenüber `22.x`) wurde erst im Review gefunden. Hätte der Autor mit einem Diff-Blick auf die Node-Stellen verhindern können.
- **Nutzer:** 2 Freigaben, keine Rückfragen. Die Vercel-Projekteinstellung ist manuell und noch offen.
- **Notiz:** Die Node-Version der Läufe ist v26.8.2. Die Sekundärquellen-Angabe zu Node 26 wurde durch die offizielle Vercel-Doku und nodejs/Release ersetzt.

## 2026-11-23 – Quellenabgleich als Pflege-Agent (P1)
- **Stufen:** Autor 4 Durchgänge (~265k Tokens, ~3 min); Reviewer 2 (~135k, ~5 min); Implementierer 2 (~82k + ~82k Nachbesserung, ~2 min); Code-Review 1 (~37k, ~0,5 min); QA 1 (~36k, ~0,5 min). Modelle: laut Agentendefinition, nicht gesondert erfasst.
- **Spät gefunden:** Der Autor-Entwurf übernahm „keine Preis- und Marktdaten“ aus CLAUDE.md, ohne die Regel als Entscheidung zu markieren; die Änderung kam erst im Nutzerdialog (Stufe Freigabe, Schritt 2). Der Reviewer fand vor der Umsetzung einen Test-Blocker (Dokumententest kennt nur `[FN]`-Dateien) und eine Lücke bei der Werkzeugliste (ohne `tools` erbt der Agent MCP-Schreibwerkzeuge). Hätte der Autor mit Blick auf Dokumententests und Subagenten-Konvention verhindern können. Code-Review und QA fanden nur niedrige Befunde (Parser kennt keine Listenform von `tools`, Lesedatum ohne Datumswerkzeug); Befunde gebündelt nachgereicht.
- **Nutzer:** 9 Rückfragen, 4 Freigaben. Themen und Antworten: Form des Agenten (Projekt-Subagent); Ausgabe (Anforderungstext im Chat, keine Datei); Umfang summary (inhaltlich, nicht wörtlich); neue Regeln suchen (ja, Vorschlagsliste, höchstens zehn); ID-Kategorie (neue Kategorie P1); Zusammenfassung (Änderungen nötig: Markt- und Preisdaten sollen geprüft werden); Konflikt mit Projektregel (Regel anpassen); Umfang Preis- und Marktdaten (alle); Quellen (Sekundärquellen zugelassen); Bestätigte Vorschläge in den Anforderungstext (ja). Freigaben: Zusammenfassung zweimal, Anforderung P1 einmal.
- **Notiz:** Subagenten können nicht selbst nachfragen; Rückfragen liefen über den Hauptkontext. Probelauf des Agenten (P1.1–P1.8, P1.10) ist manuell und steht noch aus. Vorbestehend: CLAUDE.md verlangt TypeScript 5.9, package.json hat ~7.0.2 (aus dem Dependabot-Merge), nicht in diesem Lauf geändert.

## 2026-11-23 – Wunschliste Fakten KfW-Laufzeit und Bewilligungszeitraum (F2.9, F2.10)
- **Stufen (Autor, Reviewer, Implementierer, Code-Review, QA):** Autor 2 Durchgänge (~263k Tokens, ~5,5 min); Reviewer 1 (~74k, ~2,5 min); Implementierer 2 (~95k + Nachtrag, ~2 min); Code-Review 1 (~32k, ~0,5 min); QA 1 (~34k, ~0,5 min). Modelle: laut Agentendefinition, nicht gesondert erfasst.
- **Spät gefunden:** Die Wunschliste widersprach teils Primärquellen und F2.7/F2.8 (Bereiche als Referenz, Zinsbindung „ab 6 Jahren“, CO₂ 2027 ohne Verkündung). Der Autor hat das erst beim Lesen der Quellen festgestellt; hätte er vor dem Entwurf prüfen können. Der Reviewer fand einen Konflikt mit F2.4: Das neue Lesedatum der gemeinsamen Quellen hätte sechs bestehende Fakten ungültig gemacht. Der Implementierer fand nichts; Code-Review und QA nur niedrige Befunde (Wortlaut Kurzfassung, Regressionsliste).
- **Nutzer:** 7 Rückfragen, 2 Freigaben. Themen und Antworten: Umwelt-Kennwerte (Netz-CO₂, Gas-/Heizöl-Faktoren, JAZ) zurückstellen; JAZ 3,3 weglassen; Zinsbindung ohne Referenz; Bereiche nur im Fakt-Text; CO₂ 2027 nur als Hinweis; Bewilligungsfrist 458 mit Referenz 36 trotz fehlendem Rechner-Schlüssel (Nutzerentscheidung, Abweichung zu A10 im Hinweis); Rechner-Repo ist wpinvestitionsrechner (nicht wpir).
- **Notiz:** `npm run check:mcp` im Rechner läuft grün gegen den bisherigen Server (43 Feldpfade). Nach Deploy meldet er funding.approvalMonths als unbekannt, bis der Rechner den Schlüssel ergänzt. Rechner-Befunde (kfwFixYears-Text, Quelle subsidyDelayMonths, A10) liegen beim Rechner.
