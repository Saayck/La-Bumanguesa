import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AiService,
  type AiSuggestion,
  type AiExtra,
  type AiVenue,
} from '../../../core/services/ai.service';

/**
 * Recomendador de la sección Carta.
 *
 * <p>El cliente describe su antojo y la IA arma un pedido completo: hamburguesa,
 * adicionales que combinan y dónde ir a comerla. Todo se resuelve contra la base
 * de datos en el servidor, así que nunca aparece un producto o una sede que no
 * exista.
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
  protected readonly extras = signal<AiExtra[]>([]);
  protected readonly venue = signal<AiVenue | null>(null);

  protected readonly examples = signal<string[]>([
    'Algo con harto queso',
    'Picante y contundente',
    'Lo más barato que tengan',
    'Para compartir entre dos',
  ]);

  constructor() {
    this.ai.getPromptSuggestions('recommender').subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.examples.set(list.map((s) => s.promptText));
        }
      },
      error: () => {},
    });
  }

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
        this.extras.set(res.extras ?? []);
        this.venue.set(res.venue ?? null);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.reset();
        this.loading.set(false);
      },
    });
  }

  protected choose(itemId: number): void {
    this.pick.emit(itemId);
  }

  /** Vuelve al estado inicial para pedir otra recomendación. */
  protected startOver(): void {
    this.craving.set('');
    this.error.set(null);
    this.reset();
  }

  private reset(): void {
    this.intro.set(null);
    this.suggestions.set([]);
    this.extras.set([]);
    this.venue.set(null);
  }
}
