import { z } from 'zod';

/** Themes of the knowledge base. */
export const TOPICS = [
  'foerderung-kfw-458',
  'kredit-kfw-358-359',
  'steuer-35c',
  'darlehensrecht',
  'co2-preis',
  'gebaeudemodernisierung',
  'strom-netz',
  'umsatzsteuer',
] as const;
export type Topic = (typeof TOPICS)[number];

/** How well a fact is backed: official source read, only a secondary source, or an assumption of the calculator. */
export const STATUS = ['bestaetigt', 'sekundaerquelle', 'annahme'] as const;
export type Status = (typeof STATUS)[number];

/** A value of the calculator (wpir) the fact refers to: number, text (e.g. "2027-02") or switch. */
export type RefValue = number | string | boolean;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum als JJJJ-MM-TT');

export const sourceSchema = z.object({
  /** Document and reference, e.g. "BEG-EM-Richtlinie Nr. 8.4.1". */
  label: z.string().min(1),
  url: z.string().url(),
  /** Day the source was read (JJJJ-MM-TT). */
  retrievedAt: isoDate,
});

export const factSchema = z.object({
  /** Stable id, lowercase with hyphens, e.g. "kfw458-grundfoerderung". */
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  topic: z.enum(TOPICS),
  title: z.string().min(1),
  /** The rule in one or two sentences, in German, as an average reader needs it. */
  summary: z.string().min(1),
  /**
   * Reference values by field path of the calculator (e.g. "funding.grundRate": 0.3). Percentages are shares (0.3),
   * months "JJJJ-MM". `check_value` compares a value of the calculator with these.
   */
  refs: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])).default({}),
  /** First day the rule applies (JJJJ-MM-TT), if known. */
  validFrom: isoDate.optional(),
  /** Last day the rule applies (JJJJ-MM-TT); missing = open-ended or unknown. */
  validUntil: isoDate.optional(),
  status: z.enum(STATUS),
  /** Day the fact was last checked against its sources (JJJJ-MM-TT). */
  checkedAt: isoDate,
  sources: z.array(sourceSchema).min(1),
  /** Open points, e.g. a date that is still unclear. */
  note: z.string().optional(),
});

export type Fact = z.infer<typeof factSchema>;
export type FactInput = z.input<typeof factSchema>;

/** Validates and normalises a list of facts (throws on the first invalid one, naming its id). */
export function defineFacts(items: FactInput[]): Fact[] {
  return items.map((item) => {
    const parsed = factSchema.safeParse(item);
    if (!parsed.success) throw new Error(`Ungültiger Fakt "${(item as { id?: string }).id ?? '?'}": ${parsed.error.message}`);
    return parsed.data;
  });
}
