import type { Fact } from '../facts';
import { darlehensrecht } from './darlehensrecht';
import { kfw358359 } from './kfw-358-359';
import { kfw458 } from './kfw-458';
import { steuer35c } from './steuer-35c';

/** The whole knowledge base. New topic → new file in this folder and an entry here (and in TOPICS in facts.ts). */
export const FACTS: readonly Fact[] = [...kfw458, ...kfw358359, ...steuer35c, ...darlehensrecht];
