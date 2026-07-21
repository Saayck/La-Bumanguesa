import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { SiteConfigService } from '../../core/services/site-config.service';
import { BrandIcon } from '../../shared/components/brand-icon/brand-icon';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly whatsapp = inject(WhatsappService);
  private readonly site = inject(SiteConfigService);

  protected readonly brand = computed(() => this.site.config()?.brand ?? '');
  protected readonly waLinkMsg = this.whatsapp.linkWithMessage;
}
