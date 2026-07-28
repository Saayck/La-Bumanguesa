import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import type { VideoCard as VideoCardModel } from '../../../core/models/video.model';
import { BrandIcon, type BrandIconName } from '../../../shared/components/brand-icon/brand-icon';

const PLATFORM_ICON: Record<VideoCardModel['platform'], BrandIconName> = {
  tiktok: 'tiktok',
  instagram: 'instagram',
  youtube: 'youtube',
};

@Component({
  selector: 'app-video-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandIcon],
  templateUrl: './video-card.html',
  styleUrl: './video-card.scss',
})
export class VideoCard {
  readonly video = input.required<VideoCardModel>();
  @Output() playClick = new EventEmitter<VideoCardModel>();

  protected readonly iconName = computed<BrandIconName>(
    () => PLATFORM_ICON[this.video().platform],
  );

  protected readonly badgeStyle = computed(() => {
    const v = this.video();
    if (v.platform === 'instagram') {
      return {
        background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)',
        border: '1px solid rgba(255,255,255,0.3)',
      };
    }
    return {
      background: v.accentColor,
      border: v.platform === 'youtube' ? '1px solid #7a0000' : '1px solid #3a3a40',
    };
  });

  protected onPlay(event: Event): void {
    event.preventDefault();
    this.playClick.emit(this.video());
  }
}
