import { describe, expect, it } from 'vitest';
import { countWords, normalizeHooks } from './normalize';

describe('countWords', () => {
  it('counts words separated by spaces', () => {
    expect(countWords('This is a hook')).toBe(4);
  });
});

describe('normalizeHooks', () => {
  it('keeps valid hooks only', () => {
    const result = normalizeHooks(
      [
        { text: 'This hook stays under fifteen words.', category: 'The Curiosity Gap' },
        { text: '', category: 'The Negative Hook' },
      ],
      1,
    );

    expect(result).toEqual([{ text: 'This hook stays under fifteen words.', category: 'The Curiosity Gap' }]);
  });

  it('throws when not enough hooks remain', () => {
    expect(() => normalizeHooks([{ text: 'This example has way too many extra words to survive the validator today', category: 'Bad' }])).toThrow(
      'Not enough valid hooks returned',
    );
  });

  it('accepts hook alias and fallback category for provider drift', () => {
    const result = normalizeHooks([{ hook: 'You are wasting money on flights every single month.' }], 1);

    expect(result).toEqual([{ text: 'You are wasting money on flights every single month.', category: 'AI Suggested Hook' }]);
  });
});
