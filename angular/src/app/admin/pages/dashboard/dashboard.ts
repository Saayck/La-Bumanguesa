import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../admin-api.service';

interface ResourceStat {
  label: string;
  link: string;
  total: number;
  active: number;
}

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styleUrl: '../../admin.scss',
  template: `
    <h1 class="admin-title">Dashboard</h1>
    <p class="admin-subtitle">Estado general del contenido de la página</p>

    @if (loading()) {
      <div class="empty">Cargando métricas…</div>
    } @else if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    } @else {
      <div class="stat-grid">
        @for (s of stats(); track s.label) {
          <a class="stat-card" [routerLink]="s.link" style="text-decoration:none; color:inherit">
            <div class="stat-card__label">{{ s.label }}</div>
            <div class="stat-card__value">{{ s.total }}</div>
            <div class="stat-card__meta">{{ s.active }} activos · {{ s.total - s.active }} ocultos</div>
          </a>
        }
      </div>

      <div class="stat-card">
        <div class="stat-card__label">Configuración del sitio</div>
        <div class="stat-card__meta" style="margin-top:0.5rem">
          Marca: <strong>{{ brand() }}</strong> · Barra promo:
          <strong>{{ promoBar() ? 'visible' : 'oculta' }}</strong>
        </div>
        <a class="btn btn-ghost btn-sm" routerLink="/admin/site" style="margin-top:0.9rem; display:inline-block">
          Editar configuración
        </a>
      </div>
    }
  `,
})
export class Dashboard {
  private readonly api = inject(AdminApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly stats = signal<ResourceStat[]>([]);
  protected readonly brand = signal('—');
  protected readonly promoBar = signal(false);

  constructor() {
    forkJoin({
      menu: this.api.menuList(),
      videos: this.api.videoList(),
      locations: this.api.locationList(),
      hero: this.api.heroList(),
      config: this.api.siteConfigGet(),
    }).subscribe({
      next: ({ menu, videos, locations, hero, config }) => {
        this.stats.set([
          { label: 'Menú', link: '/admin/menu', total: menu.length, active: menu.filter((x) => x.active).length },
          { label: 'Videos', link: '/admin/videos', total: videos.length, active: videos.filter((x) => x.active).length },
          { label: 'Sedes', link: '/admin/locations', total: locations.length, active: locations.filter((x) => x.active).length },
          { label: 'Hero', link: '/admin/hero', total: hero.length, active: hero.filter((x) => x.active).length },
        ]);
        this.brand.set(config.brand);
        this.promoBar.set(config.showPromoBar);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las métricas. ¿El backend está en ejecución?');
        this.loading.set(false);
      },
    });
  }
}
