import { afterEach, describe, expect, it } from 'vitest';
import { getAnalyticsSnapshot, recordTelemetryEvent, resetAnalyticsSnapshot } from './analytics';

describe('analytics store', () => {
  afterEach(() => {
    resetAnalyticsSnapshot();
  });

  it('records telemetry counts and total events', async () => {
    await recordTelemetryEvent('page_view');
    await recordTelemetryEvent('generate_success');

    const snapshot = await getAnalyticsSnapshot();
    expect(snapshot.pageViews).toBe(1);
    expect(snapshot.generateSuccesses).toBe(1);
    expect(snapshot.totalEvents).toBe(2);
  });
});
