/**
 * Shape of the site configuration served by the backend (`GET /api/site-config`).
 * This is only a type — the actual values live in the database, never hardcoded here.
 */
export interface SiteConfig {
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
  hours: {
    weekdays: string;
    weekend: string;
  };
  copyrightYear: number;
  marquee: {
    text: string;
    durationSeconds: number;
  };
}
