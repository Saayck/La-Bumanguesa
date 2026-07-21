export type VideoPlatform = 'tiktok' | 'instagram' | 'youtube';

export interface VideoCard {
  id: string;
  platform: VideoPlatform;
  label: string;
  thumbnailUrl: string;
  accentColor: string;
  offsetY: number;
  url: string;
}
