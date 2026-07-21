import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteConfigService } from '../../core/services/site-config.service';
import { BrandIcon } from '../../shared/components/brand-icon/brand-icon';

@Component({
  selector: 'app-facebook-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandIcon],
  templateUrl: './facebook-cta.html',
  styleUrl: './facebook-cta.scss',
})
export class FacebookCta {
  private readonly site = inject(SiteConfigService);
  protected readonly facebookUrl = computed(() => this.site.config()?.facebookUrl ?? '#');
}
