import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-promo-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promo-bar.html',
  styleUrl: './promo-bar.scss',
})
export class PromoBar {
  private readonly whatsapp = inject(WhatsappService);
  private readonly site = inject(SiteConfigService);

  protected readonly visible = computed(() => this.site.config()?.showPromoBar ?? false);
  protected readonly city = computed(() => this.site.config()?.city ?? '');
  protected readonly phoneLink = this.whatsapp.link;
  protected readonly phoneDisplay = this.whatsapp.displayNumber;
}
