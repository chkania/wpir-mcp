import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { FACTS } from './data';
import { TOPICS, type Fact } from './facts';
import { checkValue, findFacts, knownKeys, listSources, listTopics } from './queries';

export const SERVER_NAME = 'wpir-mcp';
export const SERVER_VERSION = '0.1.0';

/** Wraps a result as MCP tool content (JSON as text) – readable by agents and by people. */
function asJson(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] };
}

/**
 * Builds the MCP server. All tools only read: the knowledge base is part of the deployment (src/data), nothing is
 * stored or changed at runtime. `facts` is a parameter so that tests can use their own data.
 */
export function createServer(facts: readonly Fact[] = FACTS): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  server.registerTool(
    'list_topics',
    {
      title: 'Themen auflisten',
      description:
        'Listet die Themen der Wissensbasis (Förderprogramme, Steuer, Darlehensrecht) mit Anzahl der Fakten und dem ältesten Prüfdatum.',
      annotations: { readOnlyHint: true },
    },
    async () => asJson(listTopics(facts)),
  );

  server.registerTool(
    'get_facts',
    {
      title: 'Fakten abrufen',
      description:
        'Liefert Fakten (Regel, Referenzwerte je Feld des Rechners, Gültigkeit, Status, Prüfdatum, Quellen). Alle Filter sind optional und werden kombiniert: Thema, Fakt-ID, Freitext oder Feldpfad des Rechners (z. B. "funding.grundRate").',
      inputSchema: {
        topic: z.enum(TOPICS).optional().describe('Thema, siehe list_topics'),
        id: z.string().optional().describe('Fakt-ID, z. B. "kfw458-grundfoerderung"'),
        query: z.string().optional().describe('Freitext, alle Wörter müssen vorkommen'),
        key: z.string().optional().describe('Feldpfad des Rechners, z. B. "tax.maxBonus"'),
      },
      annotations: { readOnlyHint: true },
    },
    async (filter) => asJson(findFacts(facts, filter)),
  );

  server.registerTool(
    'list_sources',
    {
      title: 'Quellen auflisten',
      description: 'Liefert alle Quellen (Label, URL, Lesedatum) einmal, mit den Fakten, die sie belegen.',
      annotations: { readOnlyHint: true },
    },
    async () => asJson(listSources(facts)),
  );

  server.registerTool(
    'list_keys',
    {
      title: 'Bekannte Feldpfade auflisten',
      description:
        'Liefert alle Feldpfade des Rechners (z. B. "funding.grundRate"), für die die Wissensbasis einen Referenzwert hat. Alle anderen Felder kann check_value nicht prüfen.',
      annotations: { readOnlyHint: true },
    },
    async () => asJson(knownKeys(facts)),
  );

  server.registerTool(
    'check_value',
    {
      title: 'Wert prüfen',
      description:
        'Vergleicht einen Wert des Rechners mit dem Referenzwert der Wissensbasis. Antwort: status "gleich", "abweichend" oder "unbekannt" (Feldpfad nicht bekannt) sowie Referenzwert, Fakt, Prüfdatum und Quellen. Prozentwerte als Anteil (0.3), Monate als "JJJJ-MM".',
      inputSchema: {
        key: z.string().min(1).describe('Feldpfad des Rechners, z. B. "funding.grundRate"'),
        value: z.union([z.number(), z.string(), z.boolean()]).describe('Aktueller Wert im Rechner'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ key, value }) => asJson(checkValue(facts, key, value)),
  );

  return server;
}
