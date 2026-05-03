import { createDemoHooks, createDemoReplacement } from './demo';
import { normalizeHooks, normalizeSingleHook } from './normalize';
import { buildHookUserPrompt, buildRegeneratePrompt, hookSystemPrompt } from './prompt';
import type { GeneratedHook, HookAiProvider, HookGenerationInput, RegenerateHookInput } from './types';

type ProviderName = 'deepseek' | 'gemini';

type ProviderResolution = {
  provider: ProviderName | null;
  mode: 'live' | 'demo';
};

const hookArraySchema = {
  type: 'object',
  properties: {
    hooks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'A short English hook under 15 words.',
          },
          category: {
            type: 'string',
            description: 'The persuasion angle label for the hook.',
          },
        },
        required: ['text', 'category'],
      },
    },
  },
  required: ['hooks'],
} as const;

const singleHookSchema = {
  type: 'object',
  properties: {
    hook: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'A short English hook under 15 words.',
        },
        category: {
          type: 'string',
          description: 'The persuasion angle label for the hook.',
        },
      },
      required: ['text', 'category'],
    },
  },
  required: ['hook'],
} as const;

export function resolveProvider(): ProviderResolution {
  const preferred = process.env.AI_PROVIDER?.toLowerCase();
  const hasDeepSeek = Boolean(process.env.DEEPSEEK_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  if (preferred === 'deepseek' && hasDeepSeek) {
    return { provider: 'deepseek', mode: 'live' };
  }

  if (preferred === 'gemini' && hasGemini) {
    return { provider: 'gemini', mode: 'live' };
  }

  if (hasDeepSeek) {
    return { provider: 'deepseek', mode: 'live' };
  }

  if (hasGemini) {
    return { provider: 'gemini', mode: 'live' };
  }

  return { provider: null, mode: 'demo' };
}

function getDeepSeekModel(): string {
  return process.env.DEEPSEEK_MODEL?.trim() || 'deepseek-chat';
}

function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Provider did not return valid JSON');
    }
    return JSON.parse(match[0]);
  }
}

async function callDeepSeek(input: HookGenerationInput | RegenerateHookInput, single = false): Promise<GeneratedHook[] | GeneratedHook> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DeepSeek API key');
  }

  const userPrompt = single ? buildRegeneratePrompt(input as RegenerateHookInput) : buildHookUserPrompt(input);

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getDeepSeekModel(),
      temperature: 0.9,
      max_tokens: single ? 300 : 800,
      messages: [
        { role: 'system', content: hookSystemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepSeek request failed: ${detail || response.statusText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('DeepSeek returned empty content');
  }

  const parsed = await parseJsonResponse(new Response(content));
  const items = Array.isArray(parsed) ? parsed : (parsed as { hooks?: unknown; hook?: unknown }).hooks ?? (single ? (parsed as { hook?: unknown }).hook : parsed);
  return single ? normalizeSingleHook(items) : normalizeHooks(items);
}

async function callGemini(input: HookGenerationInput | RegenerateHookInput, single = false): Promise<GeneratedHook[] | GeneratedHook> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }

  const userPrompt = single ? buildRegeneratePrompt(input as RegenerateHookInput) : buildHookUserPrompt(input);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: hookSystemPrompt }],
        },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: 'application/json',
          responseJsonSchema: single ? singleHookSchema : hookArraySchema,
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${detail || response.statusText}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned empty content');
  }

  const parsed = await parseJsonResponse(new Response(text));
  const items = Array.isArray(parsed) ? parsed : (parsed as { hooks?: unknown; hook?: unknown }).hooks ?? (single ? (parsed as { hook?: unknown }).hook : parsed);
  return single ? normalizeSingleHook(items) : normalizeHooks(items);
}

export class ConfiguredHookProvider implements HookAiProvider {
  async generateHooks(input: HookGenerationInput): Promise<GeneratedHook[]> {
    const resolution = resolveProvider();
    if (resolution.mode === 'demo' || !resolution.provider) {
      return createDemoHooks(input);
    }

    const provider = resolution.provider;
    return provider === 'gemini' ? ((await callGemini(input)) as GeneratedHook[]) : ((await callDeepSeek(input)) as GeneratedHook[]);
  }

  async regenerateHook(input: RegenerateHookInput): Promise<GeneratedHook> {
    const resolution = resolveProvider();
    if (resolution.mode === 'demo' || !resolution.provider) {
      return createDemoReplacement(input);
    }

    const provider = resolution.provider;
    return provider === 'gemini' ? ((await callGemini(input, true)) as GeneratedHook) : ((await callDeepSeek(input, true)) as GeneratedHook);
  }
}

export function getHookProvider(): HookAiProvider {
  return new ConfiguredHookProvider();
}
