import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PromoBar } from '../promo-bar/promo-bar';
import { Navbar } from '../navbar/navbar';
import { Hero } from '../hero/hero';
import { Marquee } from '../marquee/marquee';
import { MenuSection } from '../menu/menu-section/menu-section';
import { VideosSection } from '../videos/videos-section/videos-section';
import { FacebookCta } from '../facebook-cta/facebook-cta';
import { LocationsSection } from '../locations/locations-section/locations-section';
import { Footer } from '../footer/footer';
import { SiteConfigService } from '../../core/services/site-config.service';

/** Public landing page — composes all the marketing sections. */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PromoBar,
    Navbar,
    Hero,
    Marquee,
    MenuSection,
    VideosSection,
    FacebookCta,
    LocationsSection,
    Footer,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly site = inject(SiteConfigService);

  protected readonly status = this.site.status;
  protected readonly marqueeText = computed(() => this.site.config()?.marquee.text ?? '');
  protected readonly marqueeDuration = computed(
    () => this.site.config()?.marquee.durationSeconds ?? 20,
  );

  retry(): void {
    this.site.reload();
  }
}
