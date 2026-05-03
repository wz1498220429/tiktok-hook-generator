import type { Metadata } from 'next';
import { getVerticalConfig } from './verticals';

export function buildGeneratorMetadata(vertical?: string): Metadata {
  const config = getVerticalConfig(vertical);
  const title = config ? `${config.headline} | TikTok Hook Master AI` : 'TikTok Hook Generator | TikTok Hook Master AI';
  const description = config
    ? `${config.description} Generate creator-first hooks with AI, retention psychology, and trend-aware formats.`
    : 'Generate viral TikTok hooks in seconds for Reels, Shorts, and TikTok videos with AI-powered retention psychology.';
  const path = vertical ? `/generator/${vertical}` : '/generator';

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
  };
}
