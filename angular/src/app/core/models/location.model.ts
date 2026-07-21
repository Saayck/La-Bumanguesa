import type { BrandAccent } from './menu-item.model';

export interface Location {
  id: string;
  name: string;
  address: string;
  accent: BrandAccent;
  mapEmbedUrl: string;
}
