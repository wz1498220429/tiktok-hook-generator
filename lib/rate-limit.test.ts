import { afterEach, describe, expect, it } from 'vitest';
import { ApiError } from './api-errors';
import { enforceRateLimit, resetRateLimitBuckets } from './rate-limit';

describe('enforceRateLimit', () => {
  afterEach(() => {
    resetRateLimitBuckets();
  });

  it('allows requests within the configured budget', () => {
    expect(() => enforceRateLimit('demo', 2, 1000)).not.toThrow();
    expect(() => enforceRateLimit('demo', 2, 1000)).not.toThrow();
  });

  it('throws ApiError after the budget is exhausted', () => {
    enforceRateLimit('demo', 1, 60_000);

    expect(() => enforceRateLimit('demo', 1, 60_000)).toThrow(ApiError);
  });
});
