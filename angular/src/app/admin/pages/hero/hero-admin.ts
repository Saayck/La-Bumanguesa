import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../admin-api.service';
import type { HeroSlideDto, HeroSlidePayload } from '../../models';

function emptyForm(): HeroSlidePayload {
  return { imageUrl: '', delaySeconds: 0, orderIndex: 0, active: true };
}

@Component({
  selector: 'app-hero-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div class="toolbar">
      <div>
        <h1 class="admin-title">Hero</h1>
        <p class="admin-subtitle" style="margin:0">Imágenes del carrusel principal</p>
      </div>
      @if (!editing()) {
        <button class="btn btn-primary" (click)="startCreate()">+ Nueva imagen</button>
      }
    </div>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (editing()) {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top:0">{{ isNew() ? 'Nueva imagen' : 'Editar imagen #' + editingId() }}</h3>
        <div class="form-grid">
          <div class="field">
            <label>Retraso de animación (seg, 0-60)</label>
            <input name="delaySeconds" type="number" min="0" max="60" [(ngModel)]="form.delaySeconds" required />
          </div>
          <div class="field">
            <label>Orden</label>
            <input name="orderIndex" type="number" min="0" [(ngModel)]="form.orderIndex" required />
          </div>
          <div class="field field-check">
            <input id="hactive" name="active" type="checkbox" [(ngModel)]="form.active" />
            <label for="hactive">Visible en la página</label>
          </div>
        </div>
        <div class="field" style="margin-top:1rem">
          <label>URL de imagen</label>
          <input name="imageUrl" [(ngModel)]="form.imageUrl" required maxlength="500" />
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
      <div class="empty">Aún no hay imágenes.</div>
    } @else {
      <table class="admin-table">
        <thead>
          <tr><th></th><th>#</th><th>Retraso</th><th>Orden</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td><img class="thumb" [src]="item.imageUrl" alt="slide" /></td>
              <td>{{ item.id }}</td>
              <td>{{ item.delaySeconds }}s</td>
              <td>{{ item.orderIndex }}</td>
              <td>
                <span class="badge-pill" [class.badge-on]="item.active" [class.badge-off]="!item.active">
                  {{ item.active ? 'Visible' : 'Oculto' }}
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
  `,
})
export class HeroAdmin {
  private readonly api = inject(AdminApiService);

  protected readonly items = signal<HeroSlideDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly isNew = signal(true);
  protected readonly editingId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected form: HeroSlidePayload = emptyForm();

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.heroList().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las imágenes.');
        this.loading.set(false);
      },
    });
  }

  startCreate(): void {
    this.form = emptyForm();
    this.form.orderIndex = this.items().length;
    this.editingId.set(null);
    this.isNew.set(true);
    this.editing.set(true);
    this.clearAlerts();
  }

  startEdit(item: HeroSlideDto): void {
    this.form = {
      imageUrl: item.imageUrl,
      delaySeconds: item.delaySeconds,
      orderIndex: item.orderIndex,
      active: item.active,
    };
    this.editingId.set(item.id);
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
    const id = this.editingId();
    const req =
      this.isNew() || id === null
        ? this.api.heroCreate(this.form)
        : this.api.heroUpdate(id, this.form);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set('Imagen guardada.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo guardar.');
      },
    });
  }

  remove(item: HeroSlideDto): void {
    if (!confirm('¿Eliminar esta imagen del hero?')) {
      return;
    }
    this.api.heroDelete(item.id).subscribe({
      next: () => {
        this.message.set('Imagen eliminada.');
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
