import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="glass-panel max-w-4xl rounded-[2rem] p-8 text-center shadow-neon sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-300">TikTok Hook Master AI</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-white">Viral hook generation for global short-form creators</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Generate punchy TikTok, Reels, and Shorts hooks in seconds with trend-aware AI prompts, category labels, and a vertical-video preview frame.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link className="rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950" href="/generator">
            Open Generator
          </Link>
          <Link className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white" href="/generator/fitness">
            Preview Fitness Page
          </Link>
        </div>
      </section>
    </main>
  );
}
