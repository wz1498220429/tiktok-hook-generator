import { allowedHookCategories } from './categories';
import type { HookGenerationInput, RegenerateHookInput } from './types';

export const hookSystemPrompt = [
  'You are a world-class TikTok viral consultant.',
  'Based on the Topic and Audience provided, generate 5 to 10 hooks that leverage psychological triggers like loss aversion, curiosity, or social proof.',
  'Each hook must be in English, under 15 words, punchy, and ready for TikTok, Reels, or Shorts.',
  'Return JSON only.',
  'Each item must include: text, category.',
  `Allowed category labels: ${allowedHookCategories.join(', ')}.`,
  'Do not use any alternative field names like hook, line, or caption.',
  'The JSON shape for batches must be: {"hooks":[{"text":"...","category":"..."}]}.',
  'The JSON shape for a single replacement must be: {"hook":{"text":"...","category":"..."}}.',
  'Make every hook sound native to short-form creator culture, not generic ad copy.',
  'Favor sharp specifics, tension, contradiction, stakes, or outcomes over vague inspiration.',
  'Avoid repeating the same opening pattern across items in the same batch.',
].join(' ');

export function buildHookUserPrompt(input: HookGenerationInput): string {
  return [
    `Topic: ${input.topic}`,
    `Audience: ${input.audience}`,
    `Tone: ${input.tone}`,
    `Trend Template: ${input.trendTemplate ?? 'None'}`,
    `Vertical: ${input.vertical ?? 'General creators'}`,
    `Hook Count: ${input.count ?? 5}`,
    'Quality bar: high-scroll-stopping specificity, natural English, no hashtags unless trend context strongly needs one.',
    'Diversity rule: vary hook mechanics across the batch instead of repeating one pattern.',
  ].join('\n');
}

export function buildRegeneratePrompt(input: RegenerateHookInput): string {
  return [
    buildHookUserPrompt(input),
    `Current Hook: ${input.currentHook ?? 'Unknown'}`,
    `Category: ${input.category ?? 'Any high-retention category'}`,
    'Generate exactly one replacement hook with a different angle.',
    'Return exactly one JSON object under the hook key.',
  ].join('\n');
}
