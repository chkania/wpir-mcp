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
