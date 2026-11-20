---
name: feature-retro
description: Retrospektive der Agentenkette /feature – wertet das Laufbuch aus und schlägt Verbesserungen an Agenten und Skill vor.
disable-model-invocation: true
---

1. Starte den Agenten `process-retro` ohne weitere Vorgaben; er liest das Laufbuch `.claude/feature-log.md` selbst.
2. Lege dem Nutzer seine Vorschläge vor – je Vorschlag Muster, Datei und Änderung – und frage per AskUserQuestion (Mehrfachauswahl), welche übernommen werden.
3. Übernimm nur die gewählten Vorschläge mit Edit. Steht eine Änderung im Widerspruch zu `CLAUDE.md` oder zu einer anderen Agentendatei, sag das, statt sie umzusetzen.
4. Hänge die Zeile „Retro <Datum>: …“ ans Laufbuch an, ergänzt um die übernommenen Vorschläge.
5. Nicht committen; nenne dem Nutzer die geänderten Dateien.
