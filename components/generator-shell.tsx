'use client';

import { useEffect, useState } from 'react';
import type { AnalyticsSnapshot, TelemetryEventName } from '@/lib/analytics';
import { FaqSection } from './faq-section';
import { HookGeneratorForm } from './hook-generator-form';
import { HookResultsList } from './hook-results-list';
import { UsagePanel } from './usage-panel';
import type { HookCardData } from './hook-card';
import type { GeneratedHook, HookGenerationInput } from '@/lib/ai/types';

type GeneratorShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  vertical?: string;
};

type UsageStatsResponse = {
  analytics: AnalyticsSnapshot;
  quota: {
    generate: { limit: number; remaining: number; retryAfterSeconds: number };
    regenerate: { limit: number; remaining: number; retryAfterSeconds: number };
  };
};

function toCardData(hooks: GeneratedHook[]): HookCardData[] {
  return hooks.map((hook, index) => ({
    id: `${hook.category}-${index}-${hook.text}`,
    text: hook.text,
    category: hook.category,
  }));
}

export function GeneratorShell({ eyebrow, title, description, vertical }: GeneratorShellProps) {
  const [hooks, setHooks] = useState<HookCardData[]>([]);
  const [context, setContext] = useState<HookGenerationInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [quota, setQuota] = useState<UsageStatsResponse['quota'] | null>(null);

  async function refreshUsage() {
    try {
      const response = await fetch('/api/usage-stats', { cache: 'no-store' });
      const data = (await response.json()) as UsageStatsResponse;
      if (response.ok) {
        setAnalytics(data.analytics);
        setQuota(data.quota);
      }
    } catch {
      // Ignore silent stats refresh failures in the UI.
    }
  }

  async function trackEvent(event: TelemetryEventName) {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event }),
      });
    } catch {
      // Ignore telemetry failures to keep primary UX responsive.
    }
  }

  useEffect(() => {
    void trackEvent('page_view');
    void trackEvent('generator_loaded');
    void refreshUsage();
  }, []);

  async function handleGenerate(payload: HookGenerationInput) {
    setError(null);
    setContext(payload);
    await trackEvent('generate_submit');

    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { hooks?: GeneratedHook[]; error?: string; retryAfterSeconds?: number };
      if (!response.ok || !data.hooks) {
        const suffix = data.retryAfterSeconds ? ` Try again in about ${data.retryAfterSeconds} seconds.` : '';
        setError((data.error ?? 'Unable to generate hooks right now.') + suffix);
        await trackEvent(response.status === 429 ? 'rate_limited' : 'generate_error');
        if (response.status >= 500 || response.status === 502) {
          await trackEvent('provider_error');
        }
        await refreshUsage();
        return;
      }

      setHooks(toCardData(data.hooks));
      await trackEvent('generate_success');
      await refreshUsage();
    } catch {
      setError('The request could not reach the server. Check your connection and try again.');
      await trackEvent('generate_error');
    }
  }

  async function handleRegenerate(hook: HookCardData) {
    if (!context) return;
    await trackEvent('regenerate_submit');

    try {
      const response = await fetch('/api/regenerate-hook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...context,
          currentHook: hook.text,
          category: hook.category,
        }),
      });

      const data = (await response.json()) as { hook?: GeneratedHook; error?: string; retryAfterSeconds?: number };
      if (!response.ok || !data.hook) {
        const suffix = data.retryAfterSeconds ? ` Try again in about ${data.retryAfterSeconds} seconds.` : '';
        setError((data.error ?? 'Unable to regenerate this hook right now.') + suffix);
        await trackEvent(response.status === 429 ? 'rate_limited' : 'regenerate_error');
        if (response.status >= 500 || response.status === 502) {
          await trackEvent('provider_error');
        }
        await refreshUsage();
        return;
      }

      setHooks((current) => current.map((item) => (item.id === hook.id ? { ...item, id: `${data.hook?.category}-${Date.now()}`, ...data.hook } : item)));
      await trackEvent('regenerate_success');
      await refreshUsage();
    } catch {
      setError('The request could not reach the server. Check your connection and try again.');
      await trackEvent('regenerate_error');
    }
  }

  async function handleCopy(hook: HookCardData) {
    await trackEvent('copy_hook');
    await refreshUsage();
    if (!error && hook.category === 'AI Suggested Hook') {
      setError('This card used a fallback category label because the provider returned an incomplete category.');
    }
  }

  return (
    <main className="min-h-screen bg-hero-radial">
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-300">{eyebrow}</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>
          {vertical ? <p className="mt-3 text-sm font-medium text-pink-300">Vertical mode: {vertical}</p> : null}
        </div>
        <div className="grid gap-8">
          <HookGeneratorForm defaultVertical={vertical} onGenerate={handleGenerate} />
          <UsagePanel analytics={analytics} quota={quota} />
          {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <HookResultsList hooks={hooks} onCopy={handleCopy} onRegenerate={handleRegenerate} />
        </div>
      </section>
      <FaqSection />
    </main>
  );
}
