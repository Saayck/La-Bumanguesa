import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import type { VideoCard } from '../../../core/models/video.model';

const FALLBACK_FOOD_VIDEOS: Record<string, string> = {
  tiktok: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  instagram: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  youtube: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&rel=0',
};

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-modal.html',
  styleUrl: './video-modal.scss',
})
export class VideoModal {
  private readonly sanitizer = inject(DomSanitizer);

  @Input({ required: true }) video!: VideoCard;
  @Output() close = new EventEmitter<void>();

  protected extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  protected readonly embedType = computed<'iframe' | 'video'>(() => {
    const url = this.video?.url || '';
    if (this.extractYoutubeId(url) || url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'iframe';
    }
    return 'video';
  });

  protected readonly safeIframeUrl = computed<SafeResourceUrl>(() => {
    const rawUrl = this.video?.url || '';
    const ytId = this.extractYoutubeId(rawUrl);
    if (ytId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&rel=0');
  });

  protected readonly videoSourceUrl = computed<string>(() => {
    const url = this.video?.url || '';
    if (url.endsWith('.mp4') || url.endsWith('.webm')) {
      return url;
    }
    const plat = (this.video?.platform || '').toLowerCase();
    return FALLBACK_FOOD_VIDEOS[plat] || FALLBACK_FOOD_VIDEOS['tiktok'];
  });

  protected closeModal(): void {
    this.close.emit();
  }
}
