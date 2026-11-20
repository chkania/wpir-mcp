# N2 – Betrieb auf Vercel

- N2.1 Der Server läuft als Vercel-Funktion (`api/mcp.ts`, Node ≥ 22); `vercel.json` leitet `/mcp` dorthin um und setzt `X-Content-Type-Options` und `Referrer-Policy`. Das Projekt ist per Git-Integration mit dem Repo verbunden; ein Push auf `main` stellt bereit. *(Test: manuell nach dem ersten Deployment)*
- N2.1a Der Quellcode ist Node-ESM-konform: relative Imports tragen die Endung `.js`, und der Typecheck läuft mit `NodeNext`, damit ein fehlender Import schon die CI und nicht erst Vercel trifft. `vercel.json` nennt `public` als Ausgabeverzeichnis (Startseite `public/index.html`), weil Vercel nach dem Build-Skript ein Ausgabeverzeichnis erwartet. `vercel.json` setzt `"framework": null`, der Einstieg heißt `src/mcp-server.ts`, TypeScript bleibt bei 5.9 und `engines` nennt `22.x`; Gründe in `CLAUDE.md` („Vercel-Besonderheiten“). *(Test: typecheck)*
- N2.2 `npm run dev` startet denselben Handler lokal unter `http://localhost:3000/mcp`.
- N2.3 Die CI (`.github/workflows/ci.yml`) führt Tests mit Abdeckung und Typecheck bei jedem Push und Pull Request aus. *(CI)*
