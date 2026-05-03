import { NextResponse } from 'next/server';
import { toApiError } from '@/lib/api-errors';
import { getHookProvider } from '@/lib/ai/provider';
import { enforceRateLimit, getClientAddress } from '@/lib/rate-limit';
import { parseRegenerationInput } from '@/lib/validators';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const clientAddress = getClientAddress(request);
    await enforceRateLimit(`regenerate:${clientAddress}`, 12, 60_000);

    const payload = await request.json();
    const input = parseRegenerationInput(payload);
    const hook = await getHookProvider().regenerateHook(input);
    return NextResponse.json({ hook });
  } catch (error) {
    const apiError = toApiError(error, 'Unable to regenerate this hook right now.');
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
