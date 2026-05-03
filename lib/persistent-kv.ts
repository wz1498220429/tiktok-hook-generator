import { Redis } from '@upstash/redis';

const memoryNumbers = new Map<string, number>();
const memoryValues = new Map<string, { value: string; expiresAt: number }>();

function getRedisClient(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return Redis.fromEnv();
}

function purgeExpiredMemoryValue(key: string): void {
  const entry = memoryValues.get(key);
  if (!entry) {
    return;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryValues.delete(key);
  }
}

export async function incrementPersistentNumber(key: string, amount = 1): Promise<number> {
  const redis = getRedisClient();
  if (redis) {
    return await redis.incrby(key, amount);
  }

  const next = (memoryNumbers.get(key) ?? 0) + amount;
  memoryNumbers.set(key, next);
  return next;
}

export async function getPersistentNumber(key: string): Promise<number> {
  const redis = getRedisClient();
  if (redis) {
    const value = await redis.get<number | string | null>(key);
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number(value) || 0;
    return 0;
  }

  return memoryNumbers.get(key) ?? 0;
}

export async function getPersistentString(key: string): Promise<string | null> {
  const redis = getRedisClient();
  if (redis) {
    const value = await redis.get<unknown>(key);
    if (typeof value === 'string') {
      return value;
    }

    if (value === null || value === undefined) {
      return null;
    }

    return JSON.stringify(value);
  }

  purgeExpiredMemoryValue(key);
  return memoryValues.get(key)?.value ?? null;
}

export async function setPersistentString(key: string, value: string, ttlSeconds?: number): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    }

    await redis.set(key, value);
    return;
  }

  memoryValues.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : Number.POSITIVE_INFINITY,
  });
}

export function resetPersistentKvForTests(): void {
  memoryNumbers.clear();
  memoryValues.clear();
}
