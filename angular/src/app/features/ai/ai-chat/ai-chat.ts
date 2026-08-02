import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService, type AiTurn } from '../../../core/services/ai.service';
import { SiteConfigService } from '../../../core/services/site-config.service';

interface Bubble extends AiTurn {
  /** Marca los mensajes de error para pintarlos distinto. */
  failed?: boolean;
}

/** Cuántos turnos se envían al modelo (limita el prompt y el gasto de CPU). */
const HISTORY_LIMIT = 10;

/**
 * Asistente virtual flotante de la landing.
 *
 * Responde sobre la carta, precios, horarios, sedes y formas de pago usando el
 * contexto real de la base de datos. Se oculta por completo si el backend
 * reporta que no hay motor de IA configurado.
 */
@Component({
  selector: 'app-ai-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss',
})
export class AiChat {
  private readonly ai = inject(AiService);
  private readonly site = inject(SiteConfigService);

  private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  protected readonly available = this.ai.enabled;
  protected readonly open = signal(false);
  protected readonly sending = signal(false);
  protected readonly draft = signal('');
  protected readonly bubbles = signal<Bubble[]>([]);

  protected readonly brand = computed(() => this.site.config()?.brand ?? 'La Bumanguesa');

  protected readonly quickPrompts = [
    '¿Qué hamburguesa me recomiendas?',
    '¿Cuáles son sus horarios?',
    '¿Dónde están ubicados?',
    '¿Cómo pago con Yape?',
  ];

  constructor() {
    // Autoscroll al último mensaje cada vez que cambia la conversación.
    effect(() => {
      this.bubbles();
      this.sending();
      queueMicrotask(() => {
        const el = this.scroller()?.nativeElement;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    });
  }

  protected toggle(): void {
    const next = !this.open();
    this.open.set(next);
    if (next && this.bubbles().length === 0) {
      this.bubbles.set([
        {
          role: 'assistant',
          content: `¡Hola! Soy el asistente de ${this.brand()}. Pregúntame por la carta, precios, horarios o cómo hacer tu pedido.`,
        },
      ]);
    }
  }

  protected useQuickPrompt(prompt: string): void {
    this.draft.set(prompt);
    this.send();
  }

  protected send(): void {
    const text = this.draft().trim();
    if (!text || this.sending()) {
      return;
    }

    this.draft.set('');
    this.sending.set(true);
    this.bubbles.update((current) => [...current, { role: 'user', content: text }]);

    // El backend no guarda estado: se manda la conversación reciente completa.
    const history: AiTurn[] = this.bubbles()
      .filter((b) => !b.failed)
      .slice(-HISTORY_LIMIT)
      .map(({ role, content }) => ({ role, content }));

    this.ai.chat(history).subscribe({
      next: (res) => {
        this.bubbles.update((current) => [...current, { role: 'assistant', content: res.reply }]);
        this.sending.set(false);
      },
      error: (err: Error) => {
        this.bubbles.update((current) => [
          ...current,
          { role: 'assistant', content: err.message, failed: true },
        ]);
        this.sending.set(false);
      },
    });
  }
}
