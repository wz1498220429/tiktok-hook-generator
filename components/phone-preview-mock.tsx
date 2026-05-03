type PhonePreviewMockProps = {
  text: string;
};

export function PhonePreviewMock({ text }: PhonePreviewMockProps) {
  return (
    <div className="relative mx-auto flex h-[320px] w-[180px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-neon">
      <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-white/20" />
      <div className="grid-glow relative mt-4 flex-1 bg-gradient-to-b from-fuchsia-500/20 via-slate-950 to-cyan-500/20 px-3 py-4">
        <div className="absolute inset-x-3 bottom-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Caption Preview</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-white">{text}</p>
        </div>
      </div>
    </div>
  );
}
