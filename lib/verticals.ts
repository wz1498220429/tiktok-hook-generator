export type VerticalConfig = {
  slug: string;
  label: string;
  headline: string;
  description: string;
  isPlaceholder?: boolean;
};

export const verticalConfigs: Record<string, VerticalConfig> = {
  fitness: {
    slug: 'fitness',
    label: 'Fitness',
    headline: 'TikTok Fitness Hook Generator',
    description: 'Create punchy fitness hooks for gym creators, coaches, and body transformation videos.',
  },
  gaming: {
    slug: 'gaming',
    label: 'Gaming',
    headline: 'TikTok Gaming Hook Generator',
    description: 'Generate gaming intro hooks for stream clips, highlights, and surprise reactions.',
  },
  beauty: {
    slug: 'beauty',
    label: 'Beauty',
    headline: 'TikTok Beauty Hook Generator',
    description: 'Craft beauty hooks for tutorials, product reviews, and GRWM short videos.',
  },
};

function humanizeVertical(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getVerticalConfig(vertical: string): VerticalConfig;
export function getVerticalConfig(vertical?: string): VerticalConfig | null;
export function getVerticalConfig(vertical?: string): VerticalConfig | null {
  if (!vertical) return null;

  const normalized = vertical.trim().toLowerCase();
  const existing = verticalConfigs[normalized];
  if (existing) {
    return existing;
  }

  const label = humanizeVertical(normalized);

  return {
    slug: normalized,
    label,
    headline: `TikTok ${label} Hook Generator`,
    description: `Generate ${label.toLowerCase()} hooks with the same AI workflow while this vertical page is still in placeholder mode.`,
    isPlaceholder: true,
  };
}
