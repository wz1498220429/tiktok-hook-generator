import type { AnalyticsSnapshot } from '@/lib/analytics';

type QuotaState = {
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

type UsagePanelProps = {
  analytics: AnalyticsSnapshot | null;
  quota: {
    generate: QuotaState;
    regenerate: QuotaState;
  } | null;
};

function formatQuotaLabel(quota: QuotaState | null): string {
  if (!quota) {
    return 'Loading';
  }

  if (quota.retryAfterSeconds > 0 && quota.remaining === 0) {
    return `Retry in ${quota.retryAfterSeconds}s`;
  }

  return `${quota.remaining}/${quota.limit} left`;
}

export function UsagePanel({ analytics, quota }: UsagePanelProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="glass-panel rounded-[2rem] p-5 shadow-neon">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Usage panel</p>
        <h2 className="mt-2 text-2xl font-black text-white">Quota snapshot and live activity</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Generate quota</p>
            <p className="mt-3 text-3xl font-black text-white">{formatQuotaLabel(quota?.generate ?? null)}</p>
            <p className="mt-2 text-sm text-slate-400">Live per-minute quota for full hook batches.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Regenerate quota</p>
            <p className="mt-3 text-3xl font-black text-white">{formatQuotaLabel(quota?.regenerate ?? null)}</p>
            <p className="mt-2 text-sm text-slate-400">Live per-minute quota for one-card refreshes.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-5 shadow-neon">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-300">Telemetry</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-slate-400">Page views</p>
            <p className="mt-2 text-2xl font-black text-white">{analytics?.pageViews ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-slate-400">Hook copies</p>
            <p className="mt-2 text-2xl font-black text-white">{analytics?.copies ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-slate-400">Generate success</p>
            <p className="mt-2 text-2xl font-black text-white">{analytics?.generateSuccesses ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-slate-400">Regenerate success</p>
            <p className="mt-2 text-2xl font-black text-white">{analytics?.regenerateSuccesses ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-slate-400">Provider errors</p>
            <p className="mt-2 text-2xl font-black text-white">{analytics?.providerErrors ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-slate-400">Rate limited</p>
            <p className="mt-2 text-2xl font-black text-white">{analytics?.rateLimited ?? 0}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
