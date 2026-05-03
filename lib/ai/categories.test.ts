import { describe, expect, it } from 'vitest';
import { normalizeCategory } from './categories';

describe('normalizeCategory', () => {
  it('maps loose provider labels to canonical categories', () => {
    expect(normalizeCategory('curiosity')).toBe('Curiosity Gap');
    expect(normalizeCategory('social proof')).toBe('Social Proof');
  });

  it('falls back when provider omits the category', () => {
    expect(normalizeCategory(undefined)).toBe('AI Suggested Hook');
  });
});
