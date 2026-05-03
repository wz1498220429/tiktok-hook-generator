import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TikTok Hook Master AI',
  description:
    'Generate viral TikTok hooks in seconds with an AI hook generator for Reels, Shorts, and creator retention.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
