# N2 – Betrieb auf Vercel

- N2.1 Der Server läuft als Vercel-Funktion (`api/mcp.ts`, Node ≥ 22); `vercel.json` leitet `/mcp` dorthin um und setzt `X-Content-Type-Options` und `Referrer-Policy`. Das Projekt ist per Git-Integration mit dem Repo verbunden; ein Push auf `main` stellt bereit. *(Test: manuell nach dem ersten Deployment)*
- N2.2 `npm run dev` startet denselben Handler lokal unter `http://localhost:3000/mcp`.
- N2.3 Die CI (`.github/workflows/ci.yml`) führt Tests mit Abdeckung und Typecheck bei jedem Push und Pull Request aus. *(CI)*
