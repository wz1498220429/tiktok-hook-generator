const categoryMatchers: Array<{ label: string; keywords: string[] }> = [
  { label: 'Curiosity Gap', keywords: ['curiosity', 'secret', 'gap', 'tease'] },
  { label: 'Loss Aversion', keywords: ['loss', 'waste', 'mistake', 'overpay'] },
  { label: 'Social Proof', keywords: ['social', 'proof', 'everyone', 'viral'] },
  { label: 'Pattern Interrupt', keywords: ['pattern', 'interrupt', 'surprising', 'unexpected'] },
  { label: 'Storytime', keywords: ['story', 'storytime', 'confession', 'journey'] },
  { label: 'Contrarian Take', keywords: ['hot take', 'controvers', 'contrarian', 'unpopular'] },
  { label: 'Authority Hook', keywords: ['expert', 'authority', 'pro', 'coach'] },
];

export const allowedHookCategories = categoryMatchers.map((item) => item.label);

export function normalizeCategory(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) {
    return 'AI Suggested Hook';
  }

  const lowered = value.toLowerCase();
  const matched = categoryMatchers.find((item) => item.keywords.some((keyword) => lowered.includes(keyword)) || lowered === item.label.toLowerCase());

  return matched?.label ?? value;
}
