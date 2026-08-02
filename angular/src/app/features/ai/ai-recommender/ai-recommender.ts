import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService, type AiSuggestion } from '../../../core/services/ai.service';

/**
 * Recomendador de la sección Carta.
 *
 * El cliente describe su antojo en lenguaje natural y la IA elige productos
 * reales de la carta (el backend descarta cualquier id inventado por el modelo,
 * así que nunca se muestra un plato que no exista).
 */
@Component({
  selector: 'app-ai-recommender',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './ai-recommender.html',
  styleUrl: './ai-recommender.scss',
})
export class AiRecommender {
  private readonly ai = inject(AiService);

  /** Emite la clave numérica del producto para que la Carta abra el modal de pedido. */
  readonly pick = output<number>();

  protected readonly available = this.ai.enabled;
  protected readonly craving = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly intro = signal<string | null>(null);
  protected readonly suggestions = signal<AiSuggestion[]>([]);

  protected readonly examples = [
    'Algo con harto queso',
    'Picante y contundente',
    'Lo más barato que tengan',
    'Para compartir entre dos',
  ];

  protected useExample(example: string): void {
    this.craving.set(example);
    this.ask();
  }

  protected ask(): void {
    const text = this.craving().trim();
    if (!text || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.ai.recommend(text).subscribe({
      next: (res) => {
        this.intro.set(res.intro);
        this.suggestions.set(res.suggestions);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.intro.set(null);
        this.suggestions.set([]);
        this.loading.set(false);
      },
    });
  }

  protected choose(itemId: number): void {
    this.pick.emit(itemId);
  }
}
