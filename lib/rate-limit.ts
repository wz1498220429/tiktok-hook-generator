import { ApiError } from './api-errors';
import { getPersistentString, setPersistentString } from './persistent-kv';

type Bucket = {
  count: number;
  resetAt: number;
};

export type RateLimitSnapshot = {
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

export function getClientAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'anonymous';
  }

  return request.headers.get('x-real-ip') || 'anonymous';
}

async function getBucket(key: string): Promise<Bucket | null> {
  const value = await getPersistentString(`rate-limit:${key}`);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Bucket;
  } catch {
    return null;
  }
}

async function setBucket(key: string, bucket: Bucket, windowMs: number): Promise<void> {
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  await setPersistentString(`rate-limit:${key}`, JSON.stringify(bucket), ttlSeconds);
}

async function buildSnapshot(key: string, limit: number, windowMs: number, now = Date.now()): Promise<RateLimitSnapshot> {
  const current = await getBucket(key);
  if (!current || current.resetAt <= now) {
    return {
      limit,
      remaining: limit,
      resetAt: now + windowMs,
      retryAfterSeconds: 0,
    };
  }

  return {
    limit,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
    retryAfterSeconds: Math.max(0, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export async function getRateLimitSnapshot(key: string, limit: number, windowMs: number): Promise<RateLimitSnapshot> {
  return await buildSnapshot(key, limit, windowMs);
}

export async function enforceRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitSnapshot> {
  const now = Date.now();
  const current = await getBucket(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    await setBucket(key, next, windowMs);
    return await buildSnapshot(key, limit, windowMs, now);
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw new ApiError(429, 'rate_limited', 'Too many AI requests. Please wait a few seconds and try again.', retryAfterSeconds);
  }

  current.count += 1;
  await setBucket(key, current, Math.max(1, current.resetAt - now));
  return await buildSnapshot(key, limit, windowMs, now);
}

export function resetRateLimitBuckets(): void {
  // Rate-limit tests run without Redis env vars, so clearing shared memory is sufficient.
}
