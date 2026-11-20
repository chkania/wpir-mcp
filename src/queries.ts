import type { Fact, RefValue, Topic } from './facts';

export interface TopicSummary {
  topic: Topic;
  count: number;
  /** Oldest `checkedAt` of the topic – how fresh the whole topic is at worst. */
  oldestCheck: string;
}

export interface SourceSummary {
  url: string;
  label: string;
  retrievedAt: string;
  factIds: string[];
}

/** Topics with number of facts and the oldest check date. */
export function listTopics(facts: readonly Fact[]): TopicSummary[] {
  const map = new Map<Topic, TopicSummary>();
  for (const f of facts) {
    const t = map.get(f.topic);
    if (!t) map.set(f.topic, { topic: f.topic, count: 1, oldestCheck: f.checkedAt });
    else {
      t.count += 1;
      if (f.checkedAt < t.oldestCheck) t.oldestCheck = f.checkedAt;
    }
  }
  return [...map.values()].sort((a, b) => a.topic.localeCompare(b.topic));
}

export interface FactFilter {
  topic?: Topic;
  id?: string;
  /** Free text, all words must occur in title, summary, id or reference keys (case-insensitive). */
  query?: string;
  /** Field path of the calculator, e.g. "funding.grundRate". */
  key?: string;
}

/** Facts that match all given filters. */
export function findFacts(facts: readonly Fact[], filter: FactFilter = {}): Fact[] {
  const words = (filter.query ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return facts.filter((f) => {
    if (filter.topic && f.topic !== filter.topic) return false;
    if (filter.id && f.id !== filter.id) return false;
    if (filter.key && !(filter.key in f.refs)) return false;
    if (!words.length) return true;
    const haystack = `${f.id} ${f.title} ${f.summary} ${Object.keys(f.refs).join(' ')}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

/** All sources once, with the facts that cite them; sorted by URL. */
export function listSources(facts: readonly Fact[]): SourceSummary[] {
  const map = new Map<string, SourceSummary>();
  for (const f of facts) {
    for (const s of f.sources) {
      const entry = map.get(s.url);
      if (!entry) map.set(s.url, { url: s.url, label: s.label, retrievedAt: s.retrievedAt, factIds: [f.id] });
      else {
        if (!entry.factIds.includes(f.id)) entry.factIds.push(f.id);
        if (s.retrievedAt > entry.retrievedAt) entry.retrievedAt = s.retrievedAt;
      }
    }
  }
  return [...map.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export type CheckStatus = 'gleich' | 'abweichend' | 'unbekannt';

export interface CheckResult {
  key: string;
  status: CheckStatus;
  /** The value that was passed in. */
  yours: RefValue;
  /** The reference value of the knowledge base; missing if the key is unknown. */
  reference?: RefValue;
  /** The fact the reference comes from; missing if the key is unknown. */
  fact?: Pick<Fact, 'id' | 'title' | 'status' | 'checkedAt' | 'validFrom' | 'validUntil' | 'sources' | 'note'>;
}

function same(a: RefValue, b: RefValue): boolean {
  return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b;
}

/** Compares a value of the calculator with the reference value of the knowledge base. */
export function checkValue(facts: readonly Fact[], key: string, value: RefValue): CheckResult {
  const fact = facts.find((f) => key in f.refs);
  if (!fact) return { key, status: 'unbekannt', yours: value };
  const reference = fact.refs[key];
  const { id, title, status, checkedAt, validFrom, validUntil, sources, note } = fact;
  return {
    key,
    status: same(value, reference) ? 'gleich' : 'abweichend',
    yours: value,
    reference,
    fact: { id, title, status, checkedAt, validFrom, validUntil, sources, note },
  };
}

/** Field paths (keys) that the knowledge base knows, sorted. */
export function knownKeys(facts: readonly Fact[]): string[] {
  return [...new Set(facts.flatMap((f) => Object.keys(f.refs)))].sort();
}
