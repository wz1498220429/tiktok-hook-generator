'use client';

import { useMemo, useState, useTransition } from 'react';
import type { HookGenerationInput, Tone, TrendTemplate } from '@/lib/ai/types';
import { GradientButton } from './gradient-button';

const tones: Tone[] = ['Shocking', 'Educational', 'Relatable', 'Controversial', 'Storytime'];
const templates: TrendTemplate[] = ['#POV', '#LifeHack', '#UnpopularOpinion'];

type HookGeneratorFormProps = {
  defaultVertical?: string;
  onGenerate: (payload: HookGenerationInput) => Promise<void>;
};

export function HookGeneratorForm({ defaultVertical, onGenerate }: HookGeneratorFormProps) {
  const [topic, setTopic] = useState('How to save money on travel');
  const [audience, setAudience] = useState('Budget travelers');
  const [tone, setTone] = useState<Tone>('Shocking');
  const [trendTemplate, setTrendTemplate] = useState<TrendTemplate | undefined>('#POV');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const disabled = useMemo(() => !topic.trim() || !audience.trim() || isPending, [audience, isPending, topic]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!topic.trim()) {
      setError('Please enter a video topic.');
      return;
    }

    if (!audience.trim()) {
      setError('Please enter a target audience.');
      return;
    }

    setError(null);
    startTransition(async () => {
      await onGenerate({
        topic,
        audience,
        tone,
        trendTemplate,
        vertical: defaultVertical,
        count: 5,
      });
    });
  }

  return (
    <form className="glass-panel rounded-[2rem] p-6 shadow-neon" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-300">2-second retention engine</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Generate hooks built to stop the scroll</h1>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          {isPending ? <span>Generating new hooks now</span> : <span>Mobile-first TikTok style output</span>}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Video Topic</span>
          <textarea
            className="min-h-32 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400/40"
            onChange={(event) => setTopic(event.target.value)}
            placeholder="How to save money on travel"
            value={topic}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Target Audience</span>
          <input
            className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
            onChange={(event) => setAudience(event.target.value)}
            placeholder="Budget travelers"
            value={audience}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Trend Template</span>
          <select
            className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-base text-white outline-none focus:border-cyan-400/40"
            onChange={(event) => setTrendTemplate((event.target.value || undefined) as TrendTemplate | undefined)}
            value={trendTemplate ?? ''}
          >
            <option value="">None</option>
            {templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-slate-200">Tone / Vibe</p>
        <div className="flex flex-wrap gap-3">
          {tones.map((option) => {
            const active = tone === option;
            return (
              <button
                key={option}
                className={active ? 'rounded-full border border-pink-400/20 bg-pink-500/20 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300'}
                onClick={() => setTone(option)}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-rose-300">{error}</p> : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <GradientButton busy={isPending} disabled={disabled} type="submit">
          Generate Hooks
        </GradientButton>
        <p className="text-sm text-slate-400">Designed for TikTok, Reels, and Shorts creators fighting low retention.</p>
      </div>
    </form>
  );
}
