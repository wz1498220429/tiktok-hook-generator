'use client';

import clsx from 'clsx';
import { LoadingBurst } from './loading-burst';

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  busy?: boolean;
};

export function GradientButton({ className, busy = false, children, ...props }: GradientButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {busy ? (
        <span className="inline-flex items-center gap-2">
          <LoadingBurst className="h-5 w-5" />
          <span>Generating...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
