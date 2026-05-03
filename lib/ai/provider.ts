import { createDemoHooks, createDemoReplacement } from './demo';
import { normalizeHooks, normalizeSingleHook } from './normalize';
import { buildHookUserPrompt, buildRegeneratePrompt, hookSystemPrompt } from './prompt';
import type { GeneratedHook, HookAiProvider, HookGenerationInput, RegenerateHookInput } from './types';

type ProviderName = 'deepseek' | 'gemini';

function getProviderName(): ProviderName {
  const value = process.env.AI_PROVIDER?.toLowerCase();
  return value === 'gemini' ? 'gemini' : 'deepseek';
}

function hasConfiguredProvider(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY);
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
      model: 'deepseek-chat',
      temperature: 0.9,
      messages: [
        { role: 'system', content: hookSystemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error('DeepSeek request failed');
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: hookSystemPrompt }],
        },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Gemini request failed');
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
    if (!hasConfiguredProvider()) {
      return createDemoHooks(input);
    }

    const provider = getProviderName();
    return provider === 'gemini' ? ((await callGemini(input)) as GeneratedHook[]) : ((await callDeepSeek(input)) as GeneratedHook[]);
  }

  async regenerateHook(input: RegenerateHookInput): Promise<GeneratedHook> {
    if (!hasConfiguredProvider()) {
      return createDemoReplacement(input);
    }

    const provider = getProviderName();
    return provider === 'gemini' ? ((await callGemini(input, true)) as GeneratedHook) : ((await callDeepSeek(input, true)) as GeneratedHook);
  }
}

export function getHookProvider(): HookAiProvider {
  return new ConfiguredHookProvider();
}
