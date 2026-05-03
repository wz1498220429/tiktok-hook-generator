import type { HookGenerationInput, RegenerateHookInput } from './types';

export const hookSystemPrompt = [
  'You are a world-class TikTok viral consultant.',
  'Based on the Topic and Audience provided, generate 5 to 10 hooks that leverage psychological triggers like loss aversion, curiosity, or social proof.',
  'Each hook must be in English, under 15 words, punchy, and ready for TikTok, Reels, or Shorts.',
  'Return JSON only.',
  'Each item must include: text, category.',
].join(' ');

export function buildHookUserPrompt(input: HookGenerationInput): string {
  return [
    `Topic: ${input.topic}`,
    `Audience: ${input.audience}`,
    `Tone: ${input.tone}`,
    `Trend Template: ${input.trendTemplate ?? 'None'}`,
    `Vertical: ${input.vertical ?? 'General creators'}`,
    `Hook Count: ${input.count ?? 5}`,
  ].join('\n');
}

export function buildRegeneratePrompt(input: RegenerateHookInput): string {
  return [
    buildHookUserPrompt(input),
    `Current Hook: ${input.currentHook ?? 'Unknown'}`,
    `Category: ${input.category ?? 'Any high-retention category'}`,
    'Generate exactly one replacement hook with a different angle.',
  ].join('\n');
}
