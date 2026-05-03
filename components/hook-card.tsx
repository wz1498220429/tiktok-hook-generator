'use client';

import { useState } from 'react';
import { GradientButton } from './gradient-button';
import { PhonePreviewMock } from './phone-preview-mock';

export type HookCardData = {
  id: string;
  text: string;
  category: string;
};

type HookCardProps = {
  hook: HookCardData;
  onCopy?: (hook: HookCardData) => void;
  onRegenerate: (hook: HookCardData) => Promise<void>;
};

export function HookCard({ hook, onCopy, onRegenerate }: HookCardProps) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hook.text);
      setCopied(true);
      onCopy?.(hook);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function handleRegenerate() {
    setBusy(true);
    try {
      await onRegenerate(hook);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="glass-panel rounded-[2rem] p-5 shadow-neon">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            {hook.category}
          </span>
          <p className="mt-4 max-w-xl text-2xl font-black leading-tight text-white">{hook.text}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_220px] lg:items-end">
        <div className="flex flex-wrap gap-3">
          <GradientButton onClick={handleCopy} type="button">
            {copied ? 'Copied' : 'Copy to Clipboard'}
          </GradientButton>
          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            onClick={handleRegenerate}
            type="button"
          >
            {busy ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
        <PhonePreviewMock text={hook.text} />
      </div>
    </article>
  );
}
