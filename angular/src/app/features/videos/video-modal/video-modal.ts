import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { VideoCard } from '../../../core/models/video.model';

const SAMPLE_MP4_VIDEOS: Record<string, string> = {
  tiktok: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  instagram: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  youtube: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
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
  @Input({ required: true }) video!: VideoCard;
  @Output() close = new EventEmitter<void>();

  protected readonly videoSourceUrl = computed(() => {
    const url = this.video.url;
    if (url.endsWith('.mp4') || url.endsWith('.webm')) {
      return url;
    }
    const plat = this.video.platform.toLowerCase();
    return SAMPLE_MP4_VIDEOS[plat] || SAMPLE_MP4_VIDEOS['tiktok'];
  });

  protected closeModal(): void {
    this.close.emit();
  }
}
