import type { BrandAccent } from '../../core/models/menu-item.model';

const ACCENT_HEX: Record<BrandAccent, string> = {
  yellow: '#FFD700',
  pink: '#FF0066',
  green: '#AEEA00',
};

const ACCENT_TEXT: Record<BrandAccent, string> = {
  yellow: '#000',
  pink: '#fff',
  green: '#000',
};

export function accentBg(accent: BrandAccent): string {
  return ACCENT_HEX[accent];
}

export function accentText(accent: BrandAccent): string {
  return ACCENT_TEXT[accent];
}
