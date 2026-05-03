'use client';

import { HookCard, type HookCardData } from './hook-card';

type HookResultsListProps = {
  hooks: HookCardData[];
  onCopy?: (hook: HookCardData) => void;
  onRegenerate: (hook: HookCardData) => Promise<void>;
};

export function HookResultsList({ hooks, onCopy, onRegenerate }: HookResultsListProps) {
  if (!hooks.length) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-slate-300 shadow-neon">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-300">Preview Output</p>
        <h2 className="mt-3 text-2xl font-black text-white">Your hook cards will land here</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Generate a batch to compare curiosity hooks, hot takes, story-led openers, and negative framing angles in one view.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {hooks.map((hook) => (
        <HookCard key={hook.id} hook={hook} onCopy={onCopy} onRegenerate={onRegenerate} />
      ))}
    </section>
  );
}
