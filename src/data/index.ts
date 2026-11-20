import type { Fact } from '../facts.js';
import { darlehensrecht } from './darlehensrecht.js';
import { kfw358359 } from './kfw-358-359.js';
import { kfw458 } from './kfw-458.js';
import { steuer35c } from './steuer-35c.js';

/** The whole knowledge base. New topic → new file in this folder and an entry here (and in TOPICS in facts.ts). */
export const FACTS: readonly Fact[] = [...kfw458, ...kfw358359, ...steuer35c, ...darlehensrecht];
