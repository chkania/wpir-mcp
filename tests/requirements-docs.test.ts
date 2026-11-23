import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Requirements live in docs/anforderungen/, one file per requirement (N3)
const dir = new URL('../docs/anforderungen/', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, dir), 'utf8');
const files = readdirSync(dir).filter((f) => /^[FNP]\d+-[a-z0-9-]+\.md$/.test(f));
const index = read('README.md');

describe('Anforderungen – eine Datei je Anforderung', () => {
  it('enthält die bestehenden Anforderungen', () => {
    expect(files).toContain('F3-werkzeuge.md');
    expect(files).toContain('N1-nur-lesend-oeffentlich.md');
    expect(files).toContain('P1-quellenabgleich.md');
    expect(readdirSync(dir).filter((f) => f.endsWith('.md') && !files.includes(f)).sort()).toEqual(['README.md', 'aenderungsprotokoll.md', 'produktbeschreibung.md']);
  });

  it('Dateiname, Überschrift und Unterpunkte tragen dieselbe ID', () => {
    for (const f of files) {
      const id = f.split('-')[0];
      const text = read(f);
      expect(text.split('\n')[0], f).toMatch(new RegExp(`^# ${id} – \\S`));
      const items = [...text.matchAll(/^- ([FNP]\d+)(?:\.\d+)? /gm)].map((m) => m[1]);
      expect(items.length, f).toBeGreaterThan(0);
      expect(new Set(items), f).toEqual(new Set([id]));
    }
  });

  it('jede ID kommt nur einmal vor', () => {
    const ids = files.map((f) => f.split('-')[0]);
    expect(new Set(ids).size).toBe(ids.length);
    const items = files.flatMap((f) => [...read(f).matchAll(/^- ([FNP]\d+(?:\.\d+)?) /gm)].map((m) => m[1]));
    expect(items.filter((x, i) => items.indexOf(x) !== i)).toEqual([]);
  });

  it('der Index verlinkt genau alle Anforderungsdateien', () => {
    const linked = [...index.matchAll(/\]\(([FNP]\d+-[a-z0-9-]+\.md)\)/g)].map((m) => m[1]);
    expect([...linked].sort()).toEqual([...files].sort());
  });
});

// P1.11: prices and market data are allowed in the knowledge base, under the same mandatory fields as any fact
const productDoc = read('produktbeschreibung.md');
const claudeMd = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');

describe('Rahmenregel Preis- und Marktdaten (P1.11)', () => {
  it('P1.11 produktbeschreibung.md enthält weder „Keine Preis- und Marktdaten“ noch „keine Marktdaten“', () => {
    expect(productDoc).not.toContain('Keine Preis- und Marktdaten');
    expect(productDoc).not.toContain('keine Marktdaten');
  });

  it('P1.11 CLAUDE.md enthält nicht „Preise und Marktdaten gehören nicht hinein“', () => {
    expect(claudeMd).not.toContain('Preise und Marktdaten gehören nicht hinein');
  });

  it('P1.11 beide Dateien verlangen für Preis- und Marktdaten Quelle, Prüfdatum und Status in einem Satz', () => {
    const rule = /Preis- und Marktdaten[^\n]*Quelle[^\n]*Prüfdatum[^\n]*Status/;
    expect(productDoc).toMatch(rule);
    expect(claudeMd).toMatch(rule);
  });
});
