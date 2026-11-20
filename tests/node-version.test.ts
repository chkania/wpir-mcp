import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Die Node-Version steht an vier Stellen (N2.1a, N2.3); diese Tests sichern sie gegen Abweichungen ab.
const read = (file: string): string => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

describe('Node-Version 26.x an allen Stellen', () => {
  it('N2.1a: engines.node in package.json ist "26.x"', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.engines.node).toBe('26.x');
  });

  it('N2.1a: engines.node im Wurzeleintrag von package-lock.json ist "26.x"', () => {
    const lock = JSON.parse(read('package-lock.json'));
    expect(lock.packages[''].engines.node).toBe('26.x');
  });

  it('N2.1a: @types/node hat die Hauptversion 26', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.devDependencies['@types/node']).toMatch(/^\^26\./);
  });

  it('N2.3: jede node-version in ci.yml ist 26.x (nicht lts/*), mindestens eine vorhanden', () => {
    const values = [...read('.github/workflows/ci.yml').matchAll(/^\s*node-version:\s*(\S+)\s*$/gm)].map((m) => m[1]);
    expect(values.length).toBeGreaterThan(0);
    for (const v of values) expect(v).toBe('26.x');
  });
});
