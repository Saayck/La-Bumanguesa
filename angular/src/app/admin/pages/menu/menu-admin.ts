import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../admin-api.service';
import { AiAdminService } from '../../ai-admin.service';
import type { MenuItemDto, MenuItemPayload } from '../../models';

function emptyForm(): MenuItemPayload {
  return {
    slug: '',
    title: '',
    description: '',
    imageUrl: '',
    badge: '',
    badgeRotation: 0,
    accent: 'yellow',
    ctaLabel: 'Pedir ahora',
    orderIndex: 0,
    active: true,
  };
}

@Component({
  selector: 'app-menu-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div class="toolbar">
      <div>
        <h1 class="admin-title">Menú</h1>
        <p class="admin-subtitle" style="margin:0">Productos destacados de la carta</p>
      </div>
      @if (!editing()) {
        <button class="btn btn-primary" (click)="startCreate()">+ Nuevo producto</button>
      }
    </div>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (editing()) {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top:0">{{ isNew() ? 'Nuevo producto' : 'Editar: ' + form.slug }}</h3>
        <div class="form-grid">
          <div class="field">
            <label>Slug (identificador)</label>
            <input name="slug" [(ngModel)]="form.slug" [disabled]="!isNew()" required
                   pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
            <span class="hint">minúsculas y guiones, ej: burgers-clasica</span>
          </div>
          <div class="field">
            <label>Título</label>
            <input name="title" [(ngModel)]="form.title" required maxlength="120" />
          </div>
          <div class="field">
            <label>Etiqueta (badge)</label>
            <input name="badge" [(ngModel)]="form.badge" required maxlength="60" />
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
            <label>Rotación badge (-15 a 15)</label>
            <input name="badgeRotation" type="number" min="-15" max="15" [(ngModel)]="form.badgeRotation" required />
          </div>
          <div class="field">
            <label>Texto del botón</label>
            <input name="ctaLabel" [(ngModel)]="form.ctaLabel" required maxlength="60" />
          </div>
          <div class="field">
            <label>Orden</label>
            <input name="orderIndex" type="number" min="0" [(ngModel)]="form.orderIndex" required />
          </div>
          <div class="field field-check">
            <input id="active" name="active" type="checkbox" [(ngModel)]="form.active" />
            <label for="active">Visible en la página</label>
          </div>
        </div>
        <div class="field" style="margin-top:1rem">
          <label>URL de imagen</label>
          <input name="imageUrl" [(ngModel)]="form.imageUrl" required maxlength="500" />
        </div>
        <div class="field" style="margin-top:1rem">
          <label>
            Descripción
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              style="margin-left:.5rem"
              [disabled]="generating() || !form.title"
              (click)="generateDescription()"
            >
              {{ generating() ? '✨ Redactando…' : '✨ Generar con IA' }}
            </button>
          </label>
          <textarea name="description" [(ngModel)]="form.description" required maxlength="500"></textarea>
          <span class="hint">
            La IA usa el título y la etiqueta de precio como referencia. Revisa el texto antes de guardar.
          </span>
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
      <div class="empty">Aún no hay productos.</div>
    } @else {
      <table class="admin-table">
        <thead>
          <tr><th></th><th>Slug</th><th>Título</th><th>Acento</th><th>Orden</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td><img class="thumb" [src]="item.imageUrl" [alt]="item.title" /></td>
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.accent }}</td>
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
export class MenuAdmin {
  private readonly api = inject(AdminApiService);
  private readonly ai = inject(AiAdminService);

  protected readonly items = signal<MenuItemDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly generating = signal(false);
  protected readonly editing = signal(false);
  protected readonly isNew = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected form: MenuItemPayload = emptyForm();

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.menuList().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el menú.');
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

  startEdit(item: MenuItemDto): void {
    this.form = {
      slug: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      badge: item.badge,
      badgeRotation: item.badgeRotation,
      accent: item.accent,
      ctaLabel: item.ctaLabel,
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

  /** Pide a la IA una descripción comercial a partir del producto en edición. */
  generateDescription(): void {
    this.generating.set(true);
    this.clearAlerts();
    const brief = [
      `Producto: ${this.form.title}`,
      this.form.badge ? `Precio: ${this.form.badge}` : '',
      this.form.description ? `Descripción actual a mejorar: ${this.form.description}` : '',
    ]
      .filter(Boolean)
      .join('. ');

    this.ai.generateContent('MENU_DESCRIPTION', brief).subscribe({
      next: (res) => {
        this.form.description = res.text;
        this.generating.set(false);
        this.message.set('Descripción generada. Revísala y guarda si te convence.');
      },
      error: (err: Error) => {
        this.generating.set(false);
        this.error.set(err.message);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.clearAlerts();
    const req = this.isNew()
      ? this.api.menuCreate(this.form)
      : this.api.menuUpdate(this.form.slug, this.form);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set('Producto guardado.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo guardar.');
      },
    });
  }

  remove(item: MenuItemDto): void {
    if (!confirm(`¿Eliminar "${item.title}"?`)) {
      return;
    }
    this.api.menuDelete(item.id).subscribe({
      next: () => {
        this.message.set('Producto eliminado.');
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
