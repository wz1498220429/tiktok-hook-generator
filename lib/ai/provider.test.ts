import { afterEach, describe, expect, it } from 'vitest';
import { resolveProvider } from './provider';

const originalEnv = { ...process.env };

describe('resolveProvider', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('uses preferred deepseek provider when configured', () => {
    process.env.AI_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'configured';
    delete process.env.GEMINI_API_KEY;

    expect(resolveProvider()).toEqual({ provider: 'deepseek', mode: 'live' });
  });

  it('falls back to gemini when deepseek is preferred but unavailable', () => {
    process.env.AI_PROVIDER = 'deepseek';
    delete process.env.DEEPSEEK_API_KEY;
    process.env.GEMINI_API_KEY = 'configured';

    expect(resolveProvider()).toEqual({ provider: 'gemini', mode: 'live' });
  });

  it('returns demo mode when no provider key exists', () => {
    delete process.env.AI_PROVIDER;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.GEMINI_API_KEY;

    expect(resolveProvider()).toEqual({ provider: null, mode: 'demo' });
  });
});
