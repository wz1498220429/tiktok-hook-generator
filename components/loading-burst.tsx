'use client';

import Lottie from 'lottie-react';

const animationData = {
  v: '5.9.0',
  fr: 30,
  ip: 0,
  op: 60,
  w: 120,
  h: 120,
  nm: 'pulse',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'ring',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [60, 60, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [70, 70, 100] },
            { t: 30, s: [110, 110, 100] },
            { t: 60, s: [70, 70, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [64, 64] }, nm: 'Ellipse Path 1' },
            { ty: 'st', c: { a: 0, k: [0.133, 0.827, 0.933, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 } },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
};

type LoadingBurstProps = {
  className?: string;
};

export function LoadingBurst({ className = 'h-10 w-10' }: LoadingBurstProps) {
  return <Lottie animationData={animationData} className={className} loop />;
}
