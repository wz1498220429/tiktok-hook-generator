import { describe, expect, it } from 'vitest';
import { ApiError, toApiError } from './api-errors';

describe('toApiError', () => {
  it('preserves explicit ApiError values', () => {
    const error = new ApiError(429, 'rate_limited', 'Too many requests', 30);
    expect(toApiError(error, 'fallback')).toBe(error);
  });

  it('maps provider region failures to a user-friendly message', () => {
    const result = toApiError(new Error('Gemini request failed: User location is not supported for the API use.'), 'fallback');

    expect(result.status).toBe(502);
    expect(result.message).toContain('blocked in this region');
  });
});
