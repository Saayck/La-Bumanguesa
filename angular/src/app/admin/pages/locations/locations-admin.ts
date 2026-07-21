import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../admin-api.service';
import type { LocationDto, LocationPayload } from '../../models';

function emptyForm(): LocationPayload {
  return {
    slug: '',
    name: '',
    address: '',
    accent: 'yellow',
    mapEmbedUrl: '',
    orderIndex: 0,
    active: true,
  };
}

@Component({
  selector: 'app-locations-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div class="toolbar">
      <div>
        <h1 class="admin-title">Sedes</h1>
        <p class="admin-subtitle" style="margin:0">Locales con mapa de Google</p>
      </div>
      @if (!editing()) {
        <button class="btn btn-primary" (click)="startCreate()">+ Nueva sede</button>
      }
    </div>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (editing()) {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top:0">{{ isNew() ? 'Nueva sede' : 'Editar: ' + form.slug }}</h3>
        <div class="form-grid">
          <div class="field">
            <label>Slug</label>
            <input name="slug" [(ngModel)]="form.slug" [disabled]="!isNew()" required
                   pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          </div>
          <div class="field">
            <label>Nombre</label>
            <input name="name" [(ngModel)]="form.name" required maxlength="120" />
          </div>
          <div class="field">
            <label>Acento</label>
            <select name="accent" [(ngModel)]="form.accent">
              <option value="yellow">Amarillo</option>
              <option value="pink">Rosado</option>
              <option value="green">Verde</option>
            </select>
          </div>
          <div class="field">
            <label>Orden</label>
            <input name="orderIndex" type="number" min="0" [(ngModel)]="form.orderIndex" required />
          </div>
          <div class="field field-check">
            <input id="lactive" name="active" type="checkbox" [(ngModel)]="form.active" />
            <label for="lactive">Visible en la página</label>
          </div>
        </div>
        <div class="field" style="margin-top:1rem">
          <label>Dirección</label>
          <input name="address" [(ngModel)]="form.address" required maxlength="200" />
        </div>
        <div class="field" style="margin-top:1rem">
          <label>URL del mapa embebido (Google Maps)</label>
          <textarea name="mapEmbedUrl" [(ngModel)]="form.mapEmbedUrl" required maxlength="2000"></textarea>
          <span class="hint">Pega el enlace del iframe "Insertar un mapa" de Google Maps.</span>
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
      <div class="empty">Aún no hay sedes.</div>
    } @else {
      <table class="admin-table">
        <thead>
          <tr><th>Slug</th><th>Nombre</th><th>Dirección</th><th>Orden</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.address }}</td>
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
export class LocationsAdmin {
  private readonly api = inject(AdminApiService);

  protected readonly items = signal<LocationDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly isNew = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected form: LocationPayload = emptyForm();

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.locationList().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las sedes.');
        this.loading.set(false);
      },
    });
  }

  startCreate(): void {
    this.form = emptyForm();
    this.form.orderIndex = this.items().length;
    this.isNew.set(true);
    this.editing.set(true);
    this.clearAlerts();
  }

  startEdit(item: LocationDto): void {
    this.form = {
      slug: item.id,
      name: item.name,
      address: item.address,
      accent: item.accent,
      mapEmbedUrl: item.mapEmbedUrl,
      orderIndex: item.orderIndex,
      active: item.active,
    };
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
    const req = this.isNew()
      ? this.api.locationCreate(this.form)
      : this.api.locationUpdate(this.form.slug, this.form);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set('Sede guardada.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo guardar.');
      },
    });
  }

  remove(item: LocationDto): void {
    if (!confirm(`¿Eliminar la sede "${item.name}"?`)) {
      return;
    }
    this.api.locationDelete(item.id).subscribe({
      next: () => {
        this.message.set('Sede eliminada.');
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
