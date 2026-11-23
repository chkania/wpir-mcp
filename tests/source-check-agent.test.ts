import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The source-check agent (P1) may only use read and web tools. Without a `tools` list it would inherit every tool,
// including MCP tools with write access; `mcpServers` must not be set either.
const agentFile = new URL('../.claude/agents/source-check.md', import.meta.url);
const ALLOWED_TOOLS = ['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];

/** Returns the problems of an agent file; an empty list means the frontmatter meets P1.9. */
function frontmatterProblems(text: string | undefined): string[] {
  if (text === undefined) return ['Datei fehlt'];
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) return ['Frontmatter fehlt'];
  const fields = new Map<string, string>();
  for (const line of match[1].split('\n')) {
    const field = /^([A-Za-z]+):\s*(.*)$/.exec(line);
    if (field) fields.set(field[1], field[2].trim());
  }
  const problems: string[] = [];
  if (fields.get('name') !== 'source-check') problems.push('name ist nicht source-check');
  if (!fields.get('description')) problems.push('description fehlt');
  const lines = match[1].split('\n');
  const toolsAt = lines.findIndex((line) => /^tools:/.test(line));
  const tools = fields.get('tools');
  if (toolsAt >= 0 && /^\s+-\s/.test(lines[toolsAt + 1] ?? '')) {
    // The parser reads comma lists only; a YAML list would be skipped silently and must not pass
    problems.push('tools als YAML-Liste wird nicht unterstützt');
  } else if (tools === undefined) {
    problems.push('tools fehlt');
  } else if (tools === '') {
    // An empty list would let the agent inherit every tool
    problems.push('tools leer');
  } else {
    const names = tools.split(',').map((t) => t.trim()).filter(Boolean);
    for (const name of names) if (!ALLOWED_TOOLS.includes(name)) problems.push(`tools enthält ${name}`);
  }
  if (fields.has('mcpServers')) problems.push('mcpServers steht im Frontmatter');
  return problems;
}

describe('source-check Agent (P1.9)', () => {
  it('P1.9 Frontmatter der Agentendatei erfüllt die Vorgaben', () => {
    const text = existsSync(agentFile) ? readFileSync(agentFile, 'utf8') : undefined;
    expect(frontmatterProblems(text)).toEqual([]);
  });

  it('P1.9 erkennt eine fehlende Datei', () => {
    expect(frontmatterProblems(undefined)).toEqual(['Datei fehlt']);
  });

  it('P1.9 erkennt ein fehlendes Frontmatter', () => {
    expect(frontmatterProblems('# nur Text\n')).toEqual(['Frontmatter fehlt']);
  });

  it('P1.9 erkennt einen falschen Namen', () => {
    const text = '---\nname: other\ndescription: x\ntools: Read\n---\n';
    expect(frontmatterProblems(text)).toEqual(['name ist nicht source-check']);
  });

  it('P1.9 erkennt eine fehlende Beschreibung', () => {
    const text = '---\nname: source-check\ntools: Read\n---\n';
    expect(frontmatterProblems(text)).toEqual(['description fehlt']);
  });

  it('P1.9 erkennt fehlendes tools-Feld', () => {
    const text = '---\nname: source-check\ndescription: x\n---\n';
    expect(frontmatterProblems(text)).toEqual(['tools fehlt']);
  });

  it('P1.9 erkennt ein leeres tools-Feld', () => {
    const text = '---\nname: source-check\ndescription: x\ntools:\n---\n';
    expect(frontmatterProblems(text)).toEqual(['tools leer']);
  });

  it('P1.9 erkennt die YAML-Listenform von tools als nicht unterstützt', () => {
    const text = '---\nname: source-check\ndescription: x\ntools:\n  - Read\n  - Write\n---\n';
    expect(frontmatterProblems(text)).toEqual(['tools als YAML-Liste wird nicht unterstützt']);
  });

  it('P1.9 erkennt Werkzeuge außerhalb der Positivliste', () => {
    const text = '---\nname: source-check\ndescription: x\ntools: Read, Write, mcp__vercel__create_project, Bash\n---\n';
    expect(frontmatterProblems(text)).toEqual(['tools enthält Write', 'tools enthält mcp__vercel__create_project', 'tools enthält Bash']);
  });

  it('P1.9 erkennt mcpServers im Frontmatter', () => {
    const text = '---\nname: source-check\ndescription: x\ntools: Read\nmcpServers: vercel\n---\n';
    expect(frontmatterProblems(text)).toEqual(['mcpServers steht im Frontmatter']);
  });

  it('P1.9 akzeptiert genau die Positivliste', () => {
    const text = '---\nname: source-check\ndescription: x\ntools: Read, Grep, Glob, WebFetch, WebSearch\n---\n';
    expect(frontmatterProblems(text)).toEqual([]);
  });
});
