import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Requirements live in docs/anforderungen/, one file per requirement (N3)
const dir = new URL('../docs/anforderungen/', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, dir), 'utf8');
const files = readdirSync(dir).filter((f) => /^[FN]\d+-[a-z0-9-]+\.md$/.test(f));
const index = read('README.md');

describe('Anforderungen – eine Datei je Anforderung', () => {
  it('enthält die bestehenden Anforderungen', () => {
    expect(files).toContain('F3-werkzeuge.md');
    expect(files).toContain('N1-nur-lesend-oeffentlich.md');
    expect(readdirSync(dir).filter((f) => f.endsWith('.md') && !files.includes(f)).sort()).toEqual(['README.md', 'aenderungsprotokoll.md', 'produktbeschreibung.md']);
  });

  it('Dateiname, Überschrift und Unterpunkte tragen dieselbe ID', () => {
    for (const f of files) {
      const id = f.split('-')[0];
      const text = read(f);
      expect(text.split('\n')[0], f).toMatch(new RegExp(`^# ${id} – \\S`));
      const items = [...text.matchAll(/^- ([FN]\d+)(?:\.\d+)? /gm)].map((m) => m[1]);
      expect(items.length, f).toBeGreaterThan(0);
      expect(new Set(items), f).toEqual(new Set([id]));
    }
  });

  it('jede ID kommt nur einmal vor', () => {
    const ids = files.map((f) => f.split('-')[0]);
    expect(new Set(ids).size).toBe(ids.length);
    const items = files.flatMap((f) => [...read(f).matchAll(/^- ([FN]\d+(?:\.\d+)?) /gm)].map((m) => m[1]));
    expect(items.filter((x, i) => items.indexOf(x) !== i)).toEqual([]);
  });

  it('der Index verlinkt genau alle Anforderungsdateien', () => {
    const linked = [...index.matchAll(/\]\(([FN]\d+-[a-z0-9-]+\.md)\)/g)].map((m) => m[1]);
    expect([...linked].sort()).toEqual([...files].sort());
  });
});
