import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { WhatsappService } from '../../../core/services/whatsapp.service';
import { MenuCard } from '../menu-card/menu-card';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-menu-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuCard, SectionTitle],
  templateUrl: './menu-section.html',
  styleUrl: './menu-section.scss',
})
export class MenuSection {
  private readonly menu = inject(MenuService);
  private readonly whatsapp = inject(WhatsappService);

  protected readonly items = this.menu.list;
  protected readonly waLink = this.whatsapp.link;
}
