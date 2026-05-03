import type { HookGenerationInput, RegenerateHookInput, Tone, TrendTemplate } from './ai/types';

const tones: Tone[] = ['Shocking', 'Educational', 'Relatable', 'Controversial', 'Storytime'];
const templates: TrendTemplate[] = ['#POV', '#LifeHack', '#UnpopularOpinion'];

export function parseGenerationInput(payload: unknown): HookGenerationInput {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid request payload');
  }

  const candidate = payload as Record<string, unknown>;
  const topic = typeof candidate.topic === 'string' ? candidate.topic.trim() : '';
  const audience = typeof candidate.audience === 'string' ? candidate.audience.trim() : '';
  const tone = typeof candidate.tone === 'string' && tones.includes(candidate.tone as Tone) ? (candidate.tone as Tone) : 'Shocking';
  const trendTemplate =
    typeof candidate.trendTemplate === 'string' && templates.includes(candidate.trendTemplate as TrendTemplate)
      ? (candidate.trendTemplate as TrendTemplate)
      : undefined;
  const vertical = typeof candidate.vertical === 'string' ? candidate.vertical.trim() : undefined;

  if (!topic) {
    throw new Error('Topic is required');
  }

  if (!audience) {
    throw new Error('Audience is required');
  }

  return {
    topic,
    audience,
    tone,
    trendTemplate,
    vertical,
    count: 5,
  };
}

export function parseRegenerationInput(payload: unknown): RegenerateHookInput {
  const base = parseGenerationInput(payload);
  const candidate = payload as Record<string, unknown>;
  return {
    ...base,
    currentHook: typeof candidate.currentHook === 'string' ? candidate.currentHook.trim() : undefined,
    category: typeof candidate.category === 'string' ? candidate.category.trim() : undefined,
  };
}
