import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HeroService } from '../../core/services/hero.service';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly heroService = inject(HeroService);
  private readonly site = inject(SiteConfigService);

  protected readonly slides = this.heroService.list;
  protected readonly city = computed(() => this.site.config()?.city ?? '');
  protected readonly country = computed(() => this.site.config()?.country ?? '');
}
