import { NextResponse } from 'next/server';
import { toApiError } from '@/lib/api-errors';
import { getHookProvider } from '@/lib/ai/provider';
import { enforceRateLimit, getClientAddress } from '@/lib/rate-limit';
import { parseGenerationInput } from '@/lib/validators';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const clientAddress = getClientAddress(request);
    await enforceRateLimit(`generate:${clientAddress}`, 8, 60_000);

    const payload = await request.json();
    const input = parseGenerationInput(payload);
    const hooks = await getHookProvider().generateHooks(input);
    return NextResponse.json({ hooks });
  } catch (error) {
    const apiError = toApiError(error, 'Unable to generate hooks right now.');
    return NextResponse.json(
      {
        error: apiError.message,
        code: apiError.code,
        retryAfterSeconds: apiError.retryAfterSeconds,
      },
      {
        status: apiError.status,
        headers: apiError.retryAfterSeconds ? { 'Retry-After': String(apiError.retryAfterSeconds) } : undefined,
      },
    );
  }
}
