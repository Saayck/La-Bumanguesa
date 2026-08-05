import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiAdminService, type KnowledgeDto, type KnowledgePayload } from '../../ai-admin.service';

function emptyForm(): KnowledgePayload {
  return { topic: '', answer: '', orderIndex: 0, active: true };
}

/**
 * "Entrenamiento" del asistente.
 *
 * <p>No reentrena el modelo: escribe hechos que se inyectan en su contexto y
 * surten efecto en la siguiente pregunta. Es lo correcto para un negocio cuyos
 * datos cambian — reentrenar los pesos los congelaría.
 */
@Component({
  selector: 'app-ai-knowledge-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div class="toolbar">
      <div>
        <h1 class="admin-title">Entrenar al asistente</h1>
        <p class="admin-subtitle" style="margin: 0">
          Lo que escribas aquí lo aprende la IA al instante, sin reiniciar nada
        </p>
      </div>
      @if (!editing()) {
        <button class="btn btn-primary" (click)="startCreate()">+ Enseñar un dato</button>
      }
    </div>

    <div class="alert" style="background: var(--admin-panel-2); border-color: var(--admin-border-soft)">
      <strong>¿Qué escribir aquí?</strong> Datos sobre <strong>la comida</strong> que no viven en
      ninguna otra sección: alérgenos, qué lleva o no lleva la carta, qué se puede personalizar,
      combos. La carta, los precios, los horarios y las sedes ya los toma solo de sus propias
      páginas — no hace falta repetirlos.
      <br /><br />
      <strong>¿Qué NO escribir?</strong> Nada operativo: tiempos y zonas de delivery, reservas,
      estado de pedidos o servicios del local. Esta web es una carta digital y deriva el pedido a
      WhatsApp; ese canal maneja la operación. El asistente ya está configurado para derivar esas
      preguntas en vez de responderlas.
    </div>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (editing()) {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top: 0">{{ isNew() ? 'Nuevo dato' : 'Editar dato' }}</h3>
        <div class="form-grid">
          <div class="field">
            <label>¿De qué trata?</label>
            <input name="topic" [(ngModel)]="form.topic" required maxlength="120" />
            <span class="hint">ej: Alérgenos, Opciones sin queso, Combos, Tamaño de las carnes</span>
          </div>
          <div class="field">
            <label>Orden</label>
            <input name="orderIndex" type="number" min="0" [(ngModel)]="form.orderIndex" required />
          </div>
        </div>
        <div class="field" style="margin-top: 1rem">
          <label>Respuesta que debe dar el asistente</label>
          <textarea name="answer" [(ngModel)]="form.answer" required maxlength="1000"></textarea>
          <span class="hint">
            Escríbelo como se lo dirías a un cliente. Sé concreto: la IA lo repetirá tal cual.
          </span>
        </div>
        <div class="field field-check" style="margin-top: 1rem">
          <input id="k-active" name="active" type="checkbox" [(ngModel)]="form.active" />
          <label for="k-active">Activo (la IA lo usa)</label>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit" [disabled]="saving()">
            {{ saving() ? 'Guardando…' : 'Guardar' }}
          </button>
          <button class="btn btn-ghost" type="button" (click)="cancel()">Cancelar</button>
        </div>
      </form>
    }

    @if (loading()) {
      <div class="empty">Cargando…</div>
    } @else if (items().length === 0) {
      <div class="empty">Todavía no le has enseñado nada al asistente.</div>
    } @else {
      <table class="admin-table">
        <thead>
          <tr><th>Tema</th><th>Respuesta</th><th>Orden</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td><strong>{{ item.topic }}</strong></td>
              <td style="max-width: 420px">{{ item.answer }}</td>
              <td>{{ item.orderIndex }}</td>
              <td>
                <span class="badge-pill" [class.badge-on]="item.active" [class.badge-off]="!item.active">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-ghost btn-sm" (click)="startEdit(item)">Editar</button>
                  <button class="btn btn-danger btn-sm" (click)="remove(item)">Eliminar</button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }

    <!-- SECCIÓN SUGERENCIAS RÁPIDAS DE IA (D6) -->
    <div style="margin-top: 3rem;">
      <div class="toolbar">
        <div>
          <h2 class="admin-title" style="font-size: 1.3rem;">Sugerencias rápidas de la IA</h2>
          <p class="admin-subtitle" style="margin: 0">Chips de ejemplo en el Chat y Recomendador</p>
        </div>
      </div>

      @if (suggestions().length === 0) {
        <div class="empty">No hay sugerencias configuradas.</div>
      } @else {
        <table class="admin-table">
          <thead>
            <tr><th>Tipo</th><th>Texto de sugerencia</th><th>Orden</th><th>Estado</th></tr>
          </thead>
          <tbody>
            @for (sug of suggestions(); track sug.id) {
              <tr>
                <td><span class="badge-pill">{{ sug.kind === 'chat' ? '💬 Chat' : '🍔 Recomendador' }}</span></td>
                <td><strong>{{ sug.promptText }}</strong></td>
                <td>{{ sug.orderIndex }}</td>
                <td>
                  <span class="badge-pill" [class.badge-on]="sug.active" [class.badge-off]="!sug.active">
                    {{ sug.active ? 'Activo' : 'Oculto' }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class AiKnowledgeAdmin {
  private readonly ai = inject(AiAdminService);

  protected readonly items = signal<KnowledgeDto[]>([]);
  protected readonly suggestions = signal<any[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly isNew = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected form: KnowledgePayload = emptyForm();
  private editingId: number | null = null;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.ai.knowledgeList().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la base de conocimiento.');
        this.loading.set(false);
      },
    });
    this.ai.suggestionList().subscribe({
      next: (data) => this.suggestions.set(data),
      error: () => {},
    });
  }

  startCreate(): void {
    this.form = emptyForm();
    this.form.orderIndex = this.items().length;
    this.editingId = null;
    this.isNew.set(true);
    this.editing.set(true);
    this.clearAlerts();
  }

  startEdit(item: KnowledgeDto): void {
    this.form = {
      topic: item.topic,
      answer: item.answer,
      orderIndex: item.orderIndex,
      active: item.active,
    };
    this.editingId = item.id;
    this.isNew.set(false);
    this.editing.set(true);
    this.clearAlerts();
  }

  cancel(): void {
    this.editing.set(false);
  }

  save(): void {
    this.saving.set(true);
    this.clearAlerts();
    const req =
      this.editingId === null
        ? this.ai.knowledgeCreate(this.form)
        : this.ai.knowledgeUpdate(this.editingId, this.form);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set('Listo. El asistente ya usa este dato en su próxima respuesta.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo guardar.');
      },
    });
  }

  remove(item: KnowledgeDto): void {
    if (!confirm(`¿Eliminar "${item.topic}"? El asistente dejará de saberlo.`)) {
      return;
    }
    this.ai.knowledgeDelete(item.id).subscribe({
      next: () => {
        this.message.set('Dato eliminado.');
        this.load();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'No se pudo eliminar.'),
    });
  }

  private clearAlerts(): void {
    this.error.set(null);
    this.message.set(null);
  }
}

