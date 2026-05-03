import { describe, expect, it } from 'vitest';
import { buildGeneratorMetadata } from './metadata';

describe('buildGeneratorMetadata', () => {
  it('returns default generator metadata', () => {
    const result = buildGeneratorMetadata();
    expect(result.title).toBe('TikTok Hook Generator | TikTok Hook Master AI');
  });

  it('returns vertical metadata when a known vertical is provided', () => {
    const result = buildGeneratorMetadata('fitness');
    expect(result.title).toBe('TikTok Fitness Hook Generator | TikTok Hook Master AI');
  });

  it('returns placeholder metadata for unknown verticals', () => {
    const result = buildGeneratorMetadata('pet-grooming');
    expect(result.title).toBe('TikTok Pet Grooming Hook Generator | TikTok Hook Master AI');
  });
});
