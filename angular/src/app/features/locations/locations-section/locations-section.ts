import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationsService } from '../../../core/services/locations.service';
import { LocationCard } from '../location-card/location-card';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-locations-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LocationCard, SectionTitle],
  templateUrl: './locations-section.html',
  styleUrl: './locations-section.scss',
})
export class LocationsSection {
  private readonly locations = inject(LocationsService);
  protected readonly items = this.locations.list;
}
