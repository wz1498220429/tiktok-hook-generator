import { NextResponse } from 'next/server';
import { getHookProvider } from '@/lib/ai/provider';
import { parseGenerationInput } from '@/lib/validators';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = parseGenerationInput(payload);
    const hooks = await getHookProvider().generateHooks(input);
    return NextResponse.json({ hooks });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate hooks right now.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
