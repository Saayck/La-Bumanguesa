import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { VideosService } from '../../../core/services/videos.service';
import { VideoCard } from '../video-card/video-card';
import { VideoModal } from '../video-modal/video-modal';
import { SectionTitle } from '../../../shared/components/section-title/section-title';
import type { VideoCard as VideoCardModel } from '../../../core/models/video.model';

@Component({
  selector: 'app-videos-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VideoCard, VideoModal, SectionTitle],
  templateUrl: './videos-section.html',
  styleUrl: './videos-section.scss',
})
export class VideosSection {
  private readonly videos = inject(VideosService);
  protected readonly items = this.videos.list;
  protected readonly selectedVideo = signal<VideoCardModel | null>(null);

  protected playVideo(video: VideoCardModel): void {
    this.selectedVideo.set(video);
  }

  protected closeVideo(): void {
    this.selectedVideo.set(null);
  }
}
