import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../admin-api.service';
import type { VideoDto, VideoPayload } from '../../models';

function emptyForm(): VideoPayload {
  return {
    slug: '',
    platform: 'tiktok',
    label: '',
    thumbnailUrl: '',
    accentColor: '#ffffff',
    offsetY: 0,
    url: '#',
    orderIndex: 0,
    active: true,
  };
}

@Component({
  selector: 'app-videos-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div class="toolbar">
      <div>
        <h1 class="admin-title">Videos</h1>
        <p class="admin-subtitle" style="margin:0">Tarjetas de redes sociales</p>
      </div>
      @if (!editing()) {
        <button class="btn btn-primary" (click)="startCreate()">+ Nuevo video</button>
      }
    </div>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (editing()) {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top:0">{{ isNew() ? 'Nuevo video' : 'Editar: ' + form.slug }}</h3>
        <div class="form-grid">
          <div class="field">
            <label>Slug</label>
            <input name="slug" [(ngModel)]="form.slug" [disabled]="!isNew()" required
                   pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          </div>
          <div class="field">
            <label>Plataforma</label>
            <select name="platform" [(ngModel)]="form.platform">
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          <div class="field">
            <label>Etiqueta</label>
            <input name="label" [(ngModel)]="form.label" required maxlength="40" />
          </div>
          <div class="field">
            <label>Color de acento</label>
            <input name="accentColor" [(ngModel)]="form.accentColor" required maxlength="30" />
          </div>
          <div class="field">
            <label>Desplazamiento Y (0-500)</label>
            <input name="offsetY" type="number" min="0" max="500" [(ngModel)]="form.offsetY" required />
          </div>
          <div class="field">
            <label>Orden</label>
            <input name="orderIndex" type="number" min="0" [(ngModel)]="form.orderIndex" required />
          </div>
          <div class="field field-check">
            <input id="vactive" name="active" type="checkbox" [(ngModel)]="form.active" />
            <label for="vactive">Visible en la página</label>
          </div>
        </div>
        <div class="field" style="margin-top:1rem">
          <label>URL de miniatura</label>
          <input name="thumbnailUrl" [(ngModel)]="form.thumbnailUrl" required maxlength="500" />
        </div>
        <div class="field" style="margin-top:1rem">
          <label>URL del video</label>
          <input name="url" [(ngModel)]="form.url" required maxlength="500" />
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
      <div class="empty">Aún no hay videos.</div>
    } @else {
      <table class="admin-table">
        <thead>
          <tr><th></th><th>Slug</th><th>Plataforma</th><th>Etiqueta</th><th>Orden</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td><img class="thumb" [src]="item.thumbnailUrl" [alt]="item.label" /></td>
              <td>{{ item.id }}</td>
              <td>{{ item.platform }}</td>
              <td>{{ item.label }}</td>
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
export class VideosAdmin {
  private readonly api = inject(AdminApiService);

  protected readonly items = signal<VideoDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly isNew = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected form: VideoPayload = emptyForm();

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.videoList().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los videos.');
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

  startEdit(item: VideoDto): void {
    this.form = {
      slug: item.id,
      platform: item.platform,
      label: item.label,
      thumbnailUrl: item.thumbnailUrl,
      accentColor: item.accentColor,
      offsetY: item.offsetY,
      url: item.url,
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
      ? this.api.videoCreate(this.form)
      : this.api.videoUpdate(this.form.slug, this.form);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set('Video guardado.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo guardar.');
      },
    });
  }

  remove(item: VideoDto): void {
    if (!confirm(`¿Eliminar el video "${item.label}"?`)) {
      return;
    }
    this.api.videoDelete(item.id).subscribe({
      next: () => {
        this.message.set('Video eliminado.');
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
