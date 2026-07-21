export type BrandAccent = 'yellow' | 'pink' | 'green';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
  badgeRotation: number;
  accent: BrandAccent;
  ctaLabel: string;
}
