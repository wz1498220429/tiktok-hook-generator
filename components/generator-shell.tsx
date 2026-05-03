'use client';

import { useState } from 'react';
import { FaqSection } from './faq-section';
import { HookGeneratorForm } from './hook-generator-form';
import { HookResultsList } from './hook-results-list';
import type { HookCardData } from './hook-card';
import type { GeneratedHook, HookGenerationInput } from '@/lib/ai/types';

type GeneratorShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  vertical?: string;
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

  async function handleGenerate(payload: HookGenerationInput) {
    setError(null);
    setContext(payload);

    const response = await fetch('/api/generate-hooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { hooks?: GeneratedHook[]; error?: string };
    if (!response.ok || !data.hooks) {
      setError(data.error ?? 'Unable to generate hooks right now.');
      return;
    }

    setHooks(toCardData(data.hooks));
  }

  async function handleRegenerate(hook: HookCardData) {
    if (!context) return;

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

    const data = (await response.json()) as { hook?: GeneratedHook; error?: string };
    if (!response.ok || !data.hook) {
      setError(data.error ?? 'Unable to regenerate this hook right now.');
      return;
    }

    setHooks((current) => current.map((item) => (item.id === hook.id ? { ...item, id: `${data.hook?.category}-${Date.now()}`, ...data.hook } : item)));
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
          {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          <HookResultsList hooks={hooks} onRegenerate={handleRegenerate} />
        </div>
      </section>
      <FaqSection />
    </main>
  );
}
