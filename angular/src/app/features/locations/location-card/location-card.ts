import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import type { Location } from '../../../core/models/location.model';
import { accentBg } from '../../../shared/utils/accent.util';

@Component({
  selector: 'app-location-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-card.html',
  styleUrl: './location-card.scss',
})
export class LocationCard {
  private readonly sanitizer = inject(DomSanitizer);

  readonly location = input.required<Location>();

  protected readonly accentColor = computed(() => accentBg(this.location().accent));

  protected readonly safeMapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.location().mapEmbedUrl),
  );
}
