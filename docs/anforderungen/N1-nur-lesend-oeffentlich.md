# N1 – Nur lesend, öffentlich, ohne Nutzerdaten

- N1.1 Der Server schreibt nichts: keine Datenbank, keine Dateien, keine Sitzungen; alle Werkzeuge haben `readOnlyHint`. *(Test: server)*
- N1.2 Keine Anmeldung und keine Secrets; die Daten sind öffentliche Quellen. Die Funktion ist ohne Umgebungsvariablen lauffähig.
- N1.3 Anfragen werden nicht protokolliert (weder Feldpfade noch Werte); protokolliert werden nur Fehler ohne Anfrageinhalt.
- N1.4 Antworten enthalten keine internen Fehlerdetails. *(Test: http)*
