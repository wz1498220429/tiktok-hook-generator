import { NextResponse } from 'next/server';
import { getHookProvider } from '@/lib/ai/provider';
import { parseRegenerationInput } from '@/lib/validators';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = parseRegenerationInput(payload);
    const hook = await getHookProvider().regenerateHook(input);
    return NextResponse.json({ hook });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to regenerate this hook right now.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
