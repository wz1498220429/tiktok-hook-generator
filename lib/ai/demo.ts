import type { GeneratedHook, HookGenerationInput, RegenerateHookInput } from './types';

const categories = [
  'The Curiosity Gap',
  'The Negative Hook',
  'The Social Proof Hook',
  'The Pattern Interrupt',
  'The Fast Story Hook',
  'The Hot Take Hook',
];

function compactTopic(topic: string): string {
  return topic.replace(/[.!?]/g, '').trim();
}

export function createDemoHooks(input: HookGenerationInput): GeneratedHook[] {
  const topic = compactTopic(input.topic);
  const audience = input.audience.trim();

  return [
    { text: `Most ${audience} waste money doing ${topic} like this.`, category: categories[0] },
    { text: `Nobody told ${audience} this shortcut for ${topic}.`, category: categories[1] },
    { text: `I tested ${topic} so ${audience} do not have to.`, category: categories[2] },
    { text: `This ${input.tone.toLowerCase()} twist changed how I approach ${topic}.`, category: categories[3] },
    { text: `${input.trendTemplate ?? '#POV'}: you finally fix ${topic} in one move.`, category: categories[4] },
  ];
}

export function createDemoReplacement(input: RegenerateHookInput): GeneratedHook {
  return {
    text: `Before you post ${input.topic}, ${input.audience} need this first.`,
    category: input.category ?? categories[5],
  };
}
