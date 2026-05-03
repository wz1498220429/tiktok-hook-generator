export type Tone = 'Shocking' | 'Educational' | 'Relatable' | 'Controversial' | 'Storytime';

export type TrendTemplate = '#POV' | '#LifeHack' | '#UnpopularOpinion';

export type HookGenerationInput = {
  topic: string;
  audience: string;
  tone: Tone;
  trendTemplate?: TrendTemplate;
  vertical?: string;
  count?: number;
};

export type GeneratedHook = {
  text: string;
  category: string;
};

export type RegenerateHookInput = HookGenerationInput & {
  currentHook?: string;
  category?: string;
};

export interface HookAiProvider {
  generateHooks(input: HookGenerationInput): Promise<GeneratedHook[]>;
  regenerateHook(input: RegenerateHookInput): Promise<GeneratedHook>;
}
