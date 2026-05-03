import { ApiError } from './api-errors';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function getClientAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'anonymous';
  }

  return request.headers.get('x-real-ip') || 'anonymous';
}

export function enforceRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw new ApiError(429, 'rate_limited', 'Too many AI requests. Please wait a few seconds and try again.', retryAfterSeconds);
  }

  current.count += 1;
  buckets.set(key, current);
}

export function resetRateLimitBuckets(): void {
  buckets.clear();
}
