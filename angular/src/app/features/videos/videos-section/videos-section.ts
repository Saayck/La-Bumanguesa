import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VideosService } from '../../../core/services/videos.service';
import { VideoCard } from '../video-card/video-card';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-videos-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VideoCard, SectionTitle],
  templateUrl: './videos-section.html',
  styleUrl: './videos-section.scss',
})
export class VideosSection {
  private readonly videos = inject(VideosService);
  protected readonly items = this.videos.list;
}
