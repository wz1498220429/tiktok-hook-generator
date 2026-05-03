import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ApiError } from './api-errors';
import { enforceRateLimit, getRateLimitSnapshot, resetRateLimitBuckets } from './rate-limit';
import { resetPersistentKvForTests } from './persistent-kv';

describe('enforceRateLimit', () => {
  beforeEach(() => {
    resetPersistentKvForTests();
  });

  afterEach(() => {
    resetRateLimitBuckets();
    resetPersistentKvForTests();
  });

  it('allows requests within the configured budget', async () => {
    await expect(enforceRateLimit('demo', 2, 1000)).resolves.toBeDefined();
    await expect(enforceRateLimit('demo', 2, 1000)).resolves.toBeDefined();
  });

  it('throws ApiError after the budget is exhausted', async () => {
    await enforceRateLimit('demo', 1, 60_000);

    await expect(enforceRateLimit('demo', 1, 60_000)).rejects.toThrow(ApiError);
  });

  it('returns quota snapshots for the usage panel', async () => {
    await enforceRateLimit('demo', 3, 60_000);

    const snapshot = await getRateLimitSnapshot('demo', 3, 60_000);
    expect(snapshot.limit).toBe(3);
    expect(snapshot.remaining).toBe(2);
  });
});
