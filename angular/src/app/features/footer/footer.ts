import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteConfigService } from '../../core/services/site-config.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { BrandIcon } from '../../shared/components/brand-icon/brand-icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly whatsapp = inject(WhatsappService);
  private readonly site = inject(SiteConfigService);

  protected readonly brand = computed(() => this.site.config()?.brand ?? '');
  protected readonly year = computed(() => this.site.config()?.copyrightYear ?? new Date().getFullYear());
  protected readonly hours = computed(() => this.site.config()?.hours ?? { weekdays: '', weekend: '' });
  protected readonly facebookUrl = computed(() => this.site.config()?.facebookUrl ?? '#');
  protected readonly instagramUrl = computed(() => this.site.config()?.instagramUrl ?? '#');
  protected readonly tiktokUrl = computed(() => this.site.config()?.tiktokUrl ?? '#');
  protected readonly city = computed(() => this.site.config()?.city ?? '');
  protected readonly waLink = this.whatsapp.link;
  protected readonly waDisplay = this.whatsapp.displayNumber;
}
