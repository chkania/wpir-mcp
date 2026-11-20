# F1 – MCP-Endpunkt

- F1.1 Der Server ist als MCP-Server über Streamable HTTP erreichbar: `POST /mcp` (auf Vercel per Rewrite auf `api/mcp.ts`), Antworten als JSON. Ein Aufruf von `tools/list` oder `tools/call` ohne vorherigen `initialize` wird beantwortet (zustandslos). *(Test: http)*
- F1.2 Jede Anfrage steht für sich: ein Server und ein Transport je Anfrage, nichts bleibt zwischen Anfragen erhalten (keine Sitzungen). *(Test: http)*
- F1.3 Andere Methoden als POST werden mit 405 und `Allow: POST` abgewiesen. *(Test: http)*
- F1.4 Fehler im Server werden als JSON-RPC-Fehler „Interner Fehler“ ohne Details an den Aufrufer gemeldet (HTTP 500) und im Server-Protokoll nur mit der Fehlermeldung, nie mit dem Anfrageinhalt, festgehalten. Das gilt auch, wenn schon das Anlegen des Servers fehlschlägt. *(Test: http-error)*
