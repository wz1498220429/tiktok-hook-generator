import { NextResponse } from 'next/server';
import { recordTelemetryEvent, type TelemetryEventName } from '@/lib/analytics';

export const runtime = 'edge';

const allowedEvents = new Set<TelemetryEventName>([
  'page_view',
  'generator_loaded',
  'generate_submit',
  'generate_success',
  'generate_error',
  'regenerate_submit',
  'regenerate_success',
  'regenerate_error',
  'copy_hook',
  'provider_error',
  'rate_limited',
]);

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { event?: string } | null;
  const event = payload?.event;

  if (!event || !allowedEvents.has(event as TelemetryEventName)) {
    return NextResponse.json({ error: 'Invalid telemetry event.' }, { status: 400 });
  }

  await recordTelemetryEvent(event as TelemetryEventName);
  return NextResponse.json({ ok: true });
}
