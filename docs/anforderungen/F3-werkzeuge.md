# F3 – Werkzeuge

Alle Werkzeuge sind nur lesend (`readOnlyHint`).

- F3.1 `list_topics`: Themen mit Anzahl der Fakten und ältestem Prüfdatum, sortiert nach Thema. *(Test: queries, server)*
- F3.2 `get_facts`: Fakten gefiltert nach `topic`, `id`, Freitext `query` (alle Wörter, ohne Groß-/Kleinschreibung) und Feldpfad `key`; Filter werden kombiniert, ohne Filter alle Fakten. *(Test: queries, server)*
- F3.3 `list_sources`: jede Quelle einmal je URL mit den Fakten, die sie belegen, und dem jüngsten Lesedatum. *(Test: queries, server)*
- F3.4 `list_keys`: alle Feldpfade, für die ein Referenzwert existiert, sortiert. *(Test: queries, server)*
- F3.5 `check_value(key, value)`: vergleicht den Wert des Rechners mit dem Referenzwert. Antwort `gleich`, `abweichend` oder `unbekannt` (Feldpfad nicht bekannt); bei bekanntem Pfad mit Referenzwert, Fakt (Titel, Status, Prüfdatum, Gültigkeit, Quellen, Hinweis). Zahlen gelten bei einer Differenz unter 1e-9 als gleich. Agenten senden Zahlen und Wahrheitswerte oft als Text ("0.3", "true"): Ist der Referenzwert eine Zahl oder ein Wahrheitswert, wird ein Text, der genau eine Zahl bzw. `true`/`false` ist (Leerraum am Rand ignoriert, Groß-/Kleinschreibung bei Wahrheitswerten egal, kein Dezimalkomma, nicht leer), wie dieser Wert verglichen und die Lesart in `interpretedAs` genannt. Alles andere ist bei abweichendem Typ nie gleich; Textreferenzen (Monate „JJJJ-MM“) werden nur als Text verglichen. Eingaben werden mit `zod` geprüft (`key` nicht leer, `value` Zahl, Text oder Wahrheitswert). *(Test: queries, server, http)*
- F3.6 Die Antworten sind JSON als Text-Inhalt, auch für Menschen lesbar. *(Test: server)*
