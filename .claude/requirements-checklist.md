# Prüfliste für Anforderungen

Gemeinsame Referenz für `requirements-author` und `requirements-reviewer`. Eine Anforderung ist **vollständig**, wenn jeder Punkt beantwortet oder ausdrücklich als „betrifft nicht“ markiert ist, und **konsistent**, wenn nichts davon `docs/anforderungen/` (F*, N*) oder sich selbst widerspricht.

## Format der Anforderung

```
# <Titel aus Nutzersicht>
Ziel: <wer will was, warum – 1–3 Sätze>
IDs: <neue/geänderte IDs, nächste freie Nummer aus dem Index docs/anforderungen/README.md, z. B. F5, F3.4>
## Anforderungen
- <ID> <eine prüfbare Aussage je Punkt>
## Akzeptanzkriterien
- <beobachtbar oder per Test prüfbar, mit konkreten Werten/Beispielen>
## Betroffene Bereiche
- <Bereich>: <was sich ändert> („betrifft nicht“ weglassen)
## Annahmen
- <Annahme + Quelle>
## Abgrenzung
- <was ausdrücklich nicht dazugehört>
## Offene Punkte
- <nur, was der Nutzer entscheiden muss; leer = fertig>
```

## Prüfpunkte

0. **Rahmen:** Die Anforderung ist durch die „Leitplanken für neue Anforderungen“ in `docs/anforderungen/produktbeschreibung.md` gedeckt.
1. **Prüfbarkeit:** Jedes Akzeptanzkriterium ist ohne Interpretation als erfüllt/nicht erfüllt entscheidbar (Werte, Grenzfälle, Beispiel).
2. **Konsistenz mit dem Bestand:** keine Doppelung oder Widerspruch zu bestehenden IDs; betroffene bestehende IDs genannt; Begriffe wie in `README.md` und im Rechner.
3. **Daten:** Jeder Fakt hat Quelle (URL, Lesedatum), Prüfdatum und Status; Referenzwerte tragen den Feldpfad des Rechners (z. B. `funding.grundRate`), Prozent als Anteil, Monate als „JJJJ-MM“; offene Punkte stehen als `note`, nicht als Behauptung. Nichts ohne Quelle.
4. **Schnittstelle:** Werkzeugname, Eingaben, Ausgabeformat und Fehlerverhalten sind benannt; Abwärtskompatibilität für den Rechner-Agenten im Repo wpir geprüft oder die Änderung ausdrücklich genannt.
5. **Grenzfälle & Fehler:** leere Filter, unbekannte Feldpfade, falsche Typen, sehr lange Eingaben, doppelte IDs; Fehlerantwort als Text.
6. **Sicherheit & Datenschutz:** nur lesend, öffentlich, zustandslos; keine Nutzerdaten, keine Secrets, keine Protokollierung personenbezogener Daten (`CLAUDE.md`, N1).
7. **Dokumentation:** Pflegeregeln in `docs/anforderungen/README.md`, `README.md` (Werkzeuge, Daten), Commit-Typ nach `CONTRIBUTING.md`.
8. **Sprache:** Konventionen in `CLAUDE.md` (Sprache der Texte und des Codes).
