# N3 – Qualität

- N3.1 `npm test` und `npm run typecheck` sind vor und nach jeder Änderung grün.
- N3.2 Mindestabdeckung (`vitest.config.ts`): 90 % der Zeilen, 80 % der Verzweigungen; Unterschreiten lässt die CI fehlschlagen, die Werte werden nur nach oben angepasst.
- N3.3 Jede Anforderung nennt ihre Tests; `tests/requirements-docs.test.ts` prüft Dateinamen, IDs und Index. *(Test: requirements-docs)*
