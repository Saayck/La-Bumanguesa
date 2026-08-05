import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuExtrasService } from '../../../core/services/menu-extras.service';
import type { MenuExtra, MenuExtraRequest } from '../../../core/models/menu-extra.model';

function emptyForm(): MenuExtraRequest {
  return {
    name: '',
    price: 0,
    orderIndex: 0,
    active: true,
  };
}

@Component({
  selector: 'app-extras-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div class="toolbar">
      <div>
        <h1 class="admin-title">Adicionales</h1>
        <p class="admin-subtitle" style="margin:0">Ingredientes adicionales para "Arma tu burger"</p>
      </div>
      @if (!editing()) {
        <button class="btn btn-primary" (click)="startCreate()">+ Nuevo adicional</button>
      }
    </div>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (editing()) {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top:0">{{ selectedId ? 'Editar adicional' : 'Nuevo adicional' }}</h3>
        <div class="form-grid">
          <div class="field">
            <label>Nombre</label>
            <input name="name" [(ngModel)]="form.name" required maxlength="120" placeholder="Ej: Tocino crocante" />
          </div>
          <div class="field">
            <label>Precio (S/)</label>
            <input name="price" type="number" step="0.50" min="0" [(ngModel)]="form.price" required />
          </div>
          <div class="field">
            <label>Orden de visualización</label>
            <input name="orderIndex" type="number" min="0" [(ngModel)]="form.orderIndex" required />
          </div>
          <div class="field field-check">
            <input id="extra-active" name="active" type="checkbox" [(ngModel)]="form.active" />
            <label for="extra-active">Disponible para selección</label>
          </div>
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
      <div class="empty">Cargando adicionales…</div>
    } @else if (extras().length === 0) {
      <div class="empty">Aún no hay adicionales registrados.</div>
    } @else {
      <table class="admin-table">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Orden</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          @for (item of extras(); track item.id) {
            <tr>
              <td>{{ item.id }}</td>
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.priceLabel ?? ('S/ ' + item.price.toFixed(2)) }}</td>
              <td>{{ item.orderIndex ?? 0 }}</td>
              <td>
                <span class="badge-pill" [class.badge-on]="item.active" [class.badge-off]="!item.active">
                  {{ item.active ? 'Disponible' : 'Oculto' }}
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
export class ExtrasAdmin {
  private readonly extrasService = inject(MenuExtrasService);

  protected readonly extras = signal<MenuExtra[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);

  protected selectedId: number | null = null;
  protected form: MenuExtraRequest = emptyForm();

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.extrasService.listAllAdmin().subscribe({
      next: (data) => {
        this.extras.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los adicionales.');
        this.loading.set(false);
      },
    });
  }

  startCreate(): void {
    this.selectedId = null;
    this.form = emptyForm();
    this.form.orderIndex = this.extras().length;
    this.editing.set(true);
    this.clearAlerts();
  }

  startEdit(item: MenuExtra): void {
    this.selectedId = item.id;
    this.form = {
      name: item.name,
      price: item.price,
      orderIndex: item.orderIndex ?? 0,
      active: item.active ?? true,
    };
    this.editing.set(true);
    this.clearAlerts();
  }

  cancel(): void {
    this.editing.set(false);
  }

  save(): void {
    this.saving.set(true);
    this.clearAlerts();
    const req = this.selectedId
      ? this.extrasService.updateExtra(this.selectedId, this.form)
      : this.extrasService.createExtra(this.form);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set(this.selectedId ? 'Adicional actualizado.' : 'Adicional creado.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'Error al guardar adicional.');
      },
    });
  }

  remove(item: MenuExtra): void {
    if (!confirm(`¿Eliminar el adicional "${item.name}"?`)) {
      return;
    }
    this.extrasService.deleteExtra(item.id).subscribe({
      next: () => {
        this.message.set('Adicional eliminado.');
        this.load();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'Error al eliminar adicional.'),
    });
  }

  private clearAlerts(): void {
    this.error.set(null);
    this.message.set(null);
  }
}
