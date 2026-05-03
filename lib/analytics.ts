import { getPersistentNumber, incrementPersistentNumber, resetPersistentKvForTests } from './persistent-kv';

type CounterKey =
  | 'pageViews'
  | 'generatorLoads'
  | 'generateSubmits'
  | 'generateSuccesses'
  | 'generateErrors'
  | 'regenerateSubmits'
  | 'regenerateSuccesses'
  | 'regenerateErrors'
  | 'copies'
  | 'providerErrors'
  | 'rateLimited';

export type AnalyticsSnapshot = Record<CounterKey, number> & {
  totalEvents: number;
};

const counterKeys: CounterKey[] = [
  'pageViews',
  'generatorLoads',
  'generateSubmits',
  'generateSuccesses',
  'generateErrors',
  'regenerateSubmits',
  'regenerateSuccesses',
  'regenerateErrors',
  'copies',
  'providerErrors',
  'rateLimited',
];

export type TelemetryEventName =
  | 'page_view'
  | 'generator_loaded'
  | 'generate_submit'
  | 'generate_success'
  | 'generate_error'
  | 'regenerate_submit'
  | 'regenerate_success'
  | 'regenerate_error'
  | 'copy_hook'
  | 'provider_error'
  | 'rate_limited';

const eventMap: Record<TelemetryEventName, CounterKey> = {
  page_view: 'pageViews',
  generator_loaded: 'generatorLoads',
  generate_submit: 'generateSubmits',
  generate_success: 'generateSuccesses',
  generate_error: 'generateErrors',
  regenerate_submit: 'regenerateSubmits',
  regenerate_success: 'regenerateSuccesses',
  regenerate_error: 'regenerateErrors',
  copy_hook: 'copies',
  provider_error: 'providerErrors',
  rate_limited: 'rateLimited',
};

function analyticsCounterKey(name: CounterKey): string {
  return `analytics:${name}`;
}

export async function recordTelemetryEvent(name: TelemetryEventName): Promise<void> {
  await incrementPersistentNumber(analyticsCounterKey(eventMap[name]));
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const entries = await Promise.all(counterKeys.map(async (key) => [key, await getPersistentNumber(analyticsCounterKey(key))] as const));
  const counters = Object.fromEntries(entries) as Record<CounterKey, number>;
  const totalEvents = Object.values(counters).reduce((sum, value) => sum + value, 0);
  return {
    ...counters,
    totalEvents,
  };
}

export function resetAnalyticsSnapshot(): void {
  resetPersistentKvForTests();
}
