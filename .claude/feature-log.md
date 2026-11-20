# Laufbuch der Agentenkette `/feature`

Je Lauf ein Abschnitt, neueste unten. Der Skill `feature` hängt ihn nach Schritt 7 an; `/feature-retro` wertet das Laufbuch aus. Tokens und Dauer aus den Abschluss-Meldungen der Agenten (Summe aller Durchgänge), gerundet.

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
