import { existsSync, readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { describe, expect, it } from 'vitest';
import { TOPICS } from '../src/facts.js';
import { createServer } from '../src/mcp-server.js';

// Startseite (F4): public/index.html ist statisch, ohne Skript. Geprüft wird die Datei selbst.
const publicDir = new URL('../public/', import.meta.url);
const html = readFileSync(new URL('index.html', publicDir), 'utf8');
const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const visible = html
  .replace(/<head>[\s\S]*?<\/head>/, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ');
const section = (id: string) => html.match(new RegExp(`<section id="${id}">([\\s\\S]*?)</section>`))?.[1] ?? '';
const codes = (s: string) => [...s.matchAll(/<code>([^<]*)<\/code>/g)].map((m) => m[1]);

/** WCAG-Kontrastverhältnis zweier Farben (#rrggbb). */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

async function toolNames() {
  const client = new Client({ name: 'test', version: '1.0.0' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await Promise.all([createServer().connect(a), client.connect(b)]);
  return (await client.listTools()).tools.map((t) => t.name);
}

describe('Startseite (F4)', () => {
  it('F4.1 lädt Inter und JetBrains Mono vom eigenen Host mit font-display swap, Lizenztexte liegen daneben', () => {
    expect(style).toMatch(/font-family: 'Inter Variable';\s*src: url\(\/fonts\/inter-latin-wght-normal\.woff2\)/);
    expect(style).toMatch(/font-family: 'JetBrains Mono Variable';\s*src: url\(\/fonts\/jetbrains-mono-latin-wght-normal\.woff2\)/);
    expect(style.match(/font-display: swap;/g)).toHaveLength(2);
    for (const f of ['inter-latin-wght-normal.woff2', 'jetbrains-mono-latin-wght-normal.woff2', 'LICENSE-Inter.txt', 'LICENSE-JetBrainsMono.txt']) {
      expect(existsSync(new URL(`fonts/${f}`, publicDir)), f).toBe(true);
    }
    // Schrift-Stapel außerhalb der @font-face-Regeln enden auf eine generische Familie
    const families = [...style.replace(/@font-face\s*\{[^}]*\}/g, '').matchAll(/font-family:\s*([^;]+);/g)].map((m) => m[1]);
    expect(families.length).toBeGreaterThan(3);
    for (const f of families) expect(f, f).toMatch(/(sans-serif|monospace)$/);
  });

  it('F4.2 nennt Adresse und Befehl, nur POST, Beispielaufruf ohne Antwort', () => {
    expect(codes(section('anbindung'))).toContain('https://mcp.wpir.de/mcp');
    expect(html).toContain('<pre><code>claude mcp add --transport http wpir-mcp https://mcp.wpir.de/mcp</code></pre>');
    expect(visible).toContain('nur POST');
    expect(visible).toContain('405');
    expect(html).toContain('{ "name": "check_value", "arguments": { "key": "funding.grundRate", "value": 0.25 } }');
    expect(visible).not.toMatch(/"result"|"content"/);
  });

  it('F4.3 listet genau die Werkzeuge der Serverliste mit je einem Satz Zweck', async () => {
    const pairs = [...section('werkzeuge').matchAll(/<dt><code>([^<]+)<\/code><\/dt>\s*<dd>([^<]+)<\/dd>/g)].map((m) => [m[1], m[2]] as const);
    expect(pairs.map(([name]) => name).sort()).toEqual((await toolNames()).sort());
    for (const [name, text] of pairs) {
      expect(text, name).toMatch(/\.$/);
      expect(text.match(/\.(?=\s|$)/g), name).toHaveLength(1);
    }
  });

  it('F4.4 nennt genau die acht Themen-IDs aus TOPICS, je einmal', () => {
    const ids = codes(section('themen'));
    expect([...ids].sort()).toEqual([...TOPICS].sort());
    expect(new Set(ids).size).toBe(TOPICS.length);
  });

  it('F4.5 sagt Quelle, Prüfdatum, Status, Originalquellen, keine Beratung, öffentlich, nur lesend und keine Nutzerdaten', () => {
    for (const phrase of [
      'Quelle, Prüfdatum und Status',
      'Originalquellen',
      'keine Rechts- oder Förderberatung',
      'öffentlich',
      'nur lesend',
      'Keine Nutzerdaten',
      'gesendeten Feldpfade und Werte',
      'speichert oder protokolliert',
    ]) {
      expect(visible, phrase).toContain(phrase);
    }
  });

  it('F4.6 zeigt im sichtbaren Text kein Datum und keine Zahl vor „Fakt…“', () => {
    expect(visible).not.toMatch(/\b\d{4}-\d{2}\b/);
    expect(visible).not.toMatch(/\b\d{1,2}\.\d{1,2}\.\d{4}\b/);
    expect(visible).not.toMatch(/(?<![\w-])\d+\s+(?:[A-Za-zÄÖÜäöüß]+\s+)?Fakt/);
  });

  it('F4.7 enthält kein Skript, kein Formular, keine Ereignis-Attribute und keinen Abruf fremder Hosts', () => {
    for (const bad of ['<script', '<form', '<iframe', '<object', '<embed', 'javascript:', '@import', 'prefers-color-scheme', '<button', '<input', '<select']) {
      expect(html, bad).not.toContain(bad);
    }
    expect(html).not.toMatch(/<[^>]*\son[a-z]+\s*=/);
    // Externe Adressen nur als Link-Ziel oder als Text. Externe url() in CSS sind durch die url()-Prüfung unten abgedeckt
    // (jede url() muss mit /fonts/ beginnen), deshalb genügt hier die Prüfung der Tags.
    expect(html.replace(/href="[^"]*"/g, 'href=""')).not.toMatch(/<[^>]*(https?:|\/\/)/);
    const urls = [...style.matchAll(/url\(([^)]*)\)/g)].map((m) => m[1]);
    expect(urls).toHaveLength(2);
    for (const u of urls) expect(u, u).toMatch(/^\/fonts\//);
  });

  it('F4.9 ist immer dunkel (color-scheme dark, Farben des Rechners, Kontrast)', () => {
    expect(style).toContain('color-scheme: dark;');
    expect(style).not.toContain('color-scheme: light');
    const c = { bg: '#17181b', surface: '#1d1f23', line: '#34363c', text: '#ecebe7', muted: '#9a978d', accent: '#6fa3dc' };
    for (const [name, hex] of Object.entries(c)) expect(style, name).toContain(`${hex};`);
    expect(contrast(c.text, c.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.text, c.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.muted, c.bg)).toBeGreaterThanOrEqual(5.6);
    expect(contrast(c.muted, c.surface)).toBeGreaterThanOrEqual(5.6);
    expect(contrast(c.accent, c.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('F4.10 ist auf Deutsch, in Sie-Form, mit Lizenz-Link und noindex', () => {
    expect(html).toContain('<html lang="de">');
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(visible).not.toMatch(/\b(du|dich|dir|dein\w*|kannst|hast|bist)\b/i);
    expect(visible).toContain('PolyForm Noncommercial 1.0.0');
    expect(html).toContain('href="https://github.com/chkania/wpir-mcp/blob/main/LICENSE.md"');
  });

  it('F4.11 verlinkt den Rechner genau einmal, mit einem Satz zum Zweck des Servers', () => {
    expect(html.match(/href="https:\/\/waermepumpen-investitionsrechner\.de\/"/g)).toHaveLength(1);
    expect(html.match(/waermepumpen-investitionsrechner\.de/g)).toHaveLength(1);
    expect(html).toMatch(/dient dem <a href="https:\/\/waermepumpen-investitionsrechner\.de\/">Wärmepumpen-Investitionsrechner<\/a> als Wissensbasis/);
  });
});
