import type { Metadata } from 'next';
import { GeneratorShell } from '@/components/generator-shell';
import { buildGeneratorMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildGeneratorMetadata();

export default function GeneratorPage() {
  return (
    <GeneratorShell
      eyebrow="TikTok Hook Generator"
      title="Hooks engineered for watch-time, curiosity, and creator growth"
      description="Drop in your topic, choose a vibe, and get opening lines designed to improve retention across TikTok, Reels, and Shorts."
    />
  );
}
