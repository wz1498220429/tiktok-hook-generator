import { NextResponse } from 'next/server';
import { getAnalyticsSnapshot } from '@/lib/analytics';
import { getClientAddress, getRateLimitSnapshot } from '@/lib/rate-limit';

export const runtime = 'edge';

export async function GET(request: Request) {
  const clientAddress = getClientAddress(request);

  return NextResponse.json({
    analytics: await getAnalyticsSnapshot(),
    quota: {
      generate: await getRateLimitSnapshot(`generate:${clientAddress}`, 8, 60_000),
      regenerate: await getRateLimitSnapshot(`regenerate:${clientAddress}`, 12, 60_000),
    },
  });
}
