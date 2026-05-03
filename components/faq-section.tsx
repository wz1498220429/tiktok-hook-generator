const faqItems = [
  {
    title: 'How it works',
    body: 'TikTok Hook Master AI turns your topic, audience, vibe, and trend context into short-form opening lines optimized for 2026 creator retention, watch-time lift, and answer-engine visibility.',
  },
  {
    title: 'Why hooks matter',
    body: 'A strong hook helps TikTok, Reels, and Shorts creators win the first three seconds, improve audience retention, and increase the chance of algorithmic distribution and AI-powered content discovery.',
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">AEO FAQ</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Built for search, snippets, and creator answers</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faqItems.map((item) => (
          <article key={item.title} className="glass-panel rounded-3xl p-6 shadow-neon">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
