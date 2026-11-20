# Mitarbeit

Der Server ist die gepflegte Wissensbasis für den [Wärmepumpen-Investitionsrechner](https://github.com/chkania/wpir). Hilfe ist willkommen, besonders bei **aktuellen Quellen**: Wenn sich eine Förderregel oder Rechtsgrundlage ändert, melde es mit Quelle als Issue oder schick einen Pull Request.

## Ablauf

1. Kurzlebigen Branch von `main` anlegen, z. B. `feat/neues-thema` oder `fix/quelle-kfw`.
2. Änderung umsetzen; `npm test` und `npm run typecheck` müssen grün sein (siehe `CLAUDE.md` und `docs/anforderungen/`).
3. Pull Request auf `main` öffnen; Titel nach Conventional Commits, Beschreibung auf Deutsch.
4. Nach grüner CI zusammenführen; ein Push auf `main` stellt bei Vercel bereit.

## Mit Claude Code: die Agentenkette `/feature`

Wenn du mit [Claude Code](https://claude.com/claude-code) arbeitest, kannst du eine Änderung von der Idee bis zum Pull Request von einer Kette spezialisierter Agenten erledigen lassen: `/feature <Beschreibung>`. Die Kette läuft in diesen Stufen: Anforderung (`requirements-author`, mit Zwischenfreigabe durch dich), Anforderungs-Review (`requirements-reviewer`, danach Freigabe durch dich), Umsetzung (`implementer`), Code-Review (`code-reviewer`) und QA (`qa`, prüft auch, ob die Tests zur Anforderung passen). Die Agenten und ihre Modelle liegen in [.claude/agents/](.claude/agents/), der Ablauf in [.claude/skills/feature/SKILL.md](.claude/skills/feature/SKILL.md). Gepusht wird erst nach deiner Bestätigung. `/feature-retro` wertet das Laufbuch [.claude/feature-log.md](.claude/feature-log.md) aus und schlägt Verbesserungen vor.

## Sprache

Code, Kommentare und Namen sind englisch; Texte für Nutzer (Fakten, Werkzeug-Beschreibungen, Dokumentation) und die Beschreibung in Commit-Nachrichten deutsch.

## Neue Fakten

Jeder Fakt braucht eine Quelle mit URL und Lesedatum, ein Prüfdatum und einen Status (bestätigt, Sekundärquelle, Annahme). Details in `CLAUDE.md` unter „Daten pflegen“.
