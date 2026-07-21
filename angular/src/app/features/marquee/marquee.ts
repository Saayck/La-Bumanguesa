import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marquee.html',
  styleUrl: './marquee.scss',
})
export class Marquee {
  readonly text = input<string>('');
  readonly durationSeconds = input<number>(20);
}
