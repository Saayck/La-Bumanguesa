import { Injectable, computed, inject } from '@angular/core';
import { SiteConfigService } from './site-config.service';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly site = inject(SiteConfigService);

  private readonly number = computed(() => this.site.config()?.whatsappNumber ?? '');
  private readonly message = computed(() => this.site.config()?.defaultOrderMessage ?? '');

  readonly displayNumber = computed(() => this.site.config()?.whatsappDisplay ?? '');

  readonly link = computed(() => `https://wa.me/${this.number()}`);

  readonly linkWithMessage = computed(
    () => `https://wa.me/${this.number()}?text=${encodeURIComponent(this.message())}`,
  );

  buildLink(message?: string): string {
    const number = this.number();
    if (!message) {
      return `https://wa.me/${number}`;
    }
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
}
