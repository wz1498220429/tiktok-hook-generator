import type { GeneratedHook } from './types';

const MAX_WORDS = 15;

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function normalizeHooks(items: unknown, minimumCount = 5): GeneratedHook[] {
  if (!Array.isArray(items)) {
    throw new Error('Invalid hook payload');
  }

  const normalized = items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const candidate = item as Record<string, unknown>;
      const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';
      const category = typeof candidate.category === 'string' ? candidate.category.trim() : '';

      if (!text || !category) return null;
      if (countWords(text) > MAX_WORDS) return null;

      return { text, category } satisfies GeneratedHook;
    })
    .filter((item): item is GeneratedHook => item !== null);

  if (normalized.length < minimumCount) {
    throw new Error('Not enough valid hooks returned');
  }

  return normalized;
}

export function normalizeSingleHook(item: unknown): GeneratedHook {
  const [hook] = normalizeHooks([item], 1);
  return hook;
}
