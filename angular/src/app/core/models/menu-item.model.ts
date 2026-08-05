export type BrandAccent = 'yellow' | 'pink' | 'green';

export interface MenuItem {
  /** Slug legible (`bumanguesa`), usado en rutas y como clave de edición. */
  id: string;
  /** Clave primaria numérica: la que esperan calificaciones y recomendador. */
  itemId: number;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
  badgeRotation: number;
  accent: BrandAccent;
  ctaLabel: string;
  categorySlug?: string;
  categoryLabel?: string;
}

