import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationsService } from '../../../core/services/locations.service';
import { LocationCard } from '../location-card/location-card';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

import { computed } from '@angular/core';
import { SiteConfigService } from '../../../core/services/site-config.service';

@Component({
  selector: 'app-locations-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LocationCard, SectionTitle],
  templateUrl: './locations-section.html',
  styleUrl: './locations-section.scss',
})
export class LocationsSection {
  private readonly locations = inject(LocationsService);
  private readonly site = inject(SiteConfigService);
  protected readonly items = this.locations.list;
  protected readonly locationsTitle = computed(() => this.site.config()?.sectionTitles?.['locations'] ?? { leading: 'Nuestras', highlight: 'Sedes', accent: 'amber' });
}

