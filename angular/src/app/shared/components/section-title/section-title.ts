import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-title.html',
  styleUrl: './section-title.scss',
})
export class SectionTitle {
  readonly leading = input.required<string>();
  readonly highlight = input.required<string>();
  readonly trailing = input<string>('');
  readonly highlightColor = input<string>('#FFD700');
  readonly underlineColor = input<string>('#FF0066');
  readonly subtitle = input<string>('');
  readonly align = input<'center' | 'left'>('center');
}
