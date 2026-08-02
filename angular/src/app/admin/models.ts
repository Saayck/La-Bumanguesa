import type { BrandAccent } from '../core/models/menu-item.model';
import type { VideoPlatform } from '../core/models/video.model';

/** Response shapes returned by the admin endpoints (include order/active metadata). */
export interface MenuItemDto {
  /** Slug: es la clave que usan las rutas de update/delete del admin. */
  id: string;
  /** Clave primaria numérica (informativa en el panel). */
  itemId: number;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
  badgeRotation: number;
  accent: BrandAccent;
  ctaLabel: string;
  orderIndex: number;
  active: boolean;
}

export interface VideoDto {
  id: string;
  platform: VideoPlatform;
  label: string;
  thumbnailUrl: string;
  accentColor: string;
  offsetY: number;
  url: string;
  orderIndex: number;
  active: boolean;
}

export interface LocationDto {
  id: string;
  name: string;
  address: string;
  accent: BrandAccent;
  mapEmbedUrl: string;
  orderIndex: number;
  active: boolean;
}

export interface HeroSlideDto {
  id: number;
  imageUrl: string;
  delaySeconds: number;
  orderIndex: number;
  active: boolean;
}

/** Request payloads (what the forms submit). */
export interface MenuItemPayload {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
  badgeRotation: number;
  accent: BrandAccent;
  ctaLabel: string;
  orderIndex: number;
  active: boolean;
}

export interface VideoPayload {
  slug: string;
  platform: VideoPlatform;
  label: string;
  thumbnailUrl: string;
  accentColor: string;
  offsetY: number;
  url: string;
  orderIndex: number;
  active: boolean;
}

export interface LocationPayload {
  slug: string;
  name: string;
  address: string;
  accent: BrandAccent;
  mapEmbedUrl: string;
  orderIndex: number;
  active: boolean;
}

export interface HeroSlidePayload {
  imageUrl: string;
  delaySeconds: number;
  orderIndex: number;
  active: boolean;
}

export interface SiteConfigPayload {
  brand: string;
  city: string;
  country: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  defaultOrderMessage: string;
  showPromoBar: boolean;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  hoursWeekdays: string;
  hoursWeekend: string;
  copyrightYear: number;
  marqueeText: string;
  marqueeDurationSeconds: number;
  yapeQrUrl: string;
  yapeNumber: string;
  yapeHolder: string;
}
