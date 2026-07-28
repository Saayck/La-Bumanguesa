import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import type { MenuItem } from '../../../core/models/menu-item.model';
import { accentBg, accentText } from '../../../shared/utils/accent.util';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-card.html',
  styleUrl: './menu-card.scss',
})
export class MenuCard {
  readonly item = input.required<MenuItem>();
  readonly ctaHref = input.required<string>();

  @Output() orderClick = new EventEmitter<MenuItem>();

  protected readonly accentBg = computed(() => accentBg(this.item().accent));
  protected readonly accentText = computed(() => accentText(this.item().accent));

  protected onOrder(event: Event): void {
    event.preventDefault();
    this.orderClick.emit(this.item());
  }
}
