import type { Metadata } from 'next';
import { GeneratorShell } from '@/components/generator-shell';
import { buildGeneratorMetadata } from '@/lib/metadata';
import { getVerticalConfig } from '@/lib/verticals';

type VerticalPageProps = {
  params: Promise<{ vertical: string }>;
};

export async function generateMetadata({ params }: VerticalPageProps): Promise<Metadata> {
  const { vertical } = await params;
  return buildGeneratorMetadata(vertical);
}

export default async function VerticalGeneratorPage({ params }: VerticalPageProps) {
  const { vertical } = await params;
  const config = getVerticalConfig(vertical);

  return (
    <GeneratorShell
      description={config.description}
      eyebrow={`${config.label} creator hooks`}
      title={config.headline}
      vertical={config.slug}
    />
  );
}
