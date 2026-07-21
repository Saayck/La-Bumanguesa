import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { MenuItem } from '../../../core/models/menu-item.model';
import { accentBg, accentText } from '../../../shared/utils/accent.util';

@Component({
  selector: 'app-menu-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-card.html',
  styleUrl: './menu-card.scss',
})
export class MenuCard {
  readonly item = input.required<MenuItem>();
  readonly ctaHref = input.required<string>();

  protected readonly accentBg = computed(() => accentBg(this.item().accent));
  protected readonly accentText = computed(() => accentText(this.item().accent));
}
