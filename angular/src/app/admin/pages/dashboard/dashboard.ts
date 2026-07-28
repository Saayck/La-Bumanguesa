import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../admin-api.service';
import { API_BASE } from '../../../core/config/api.config';

interface ResourceStat {
  label: string;
  link: string;
  total: number;
  active: number;
}

interface AiRankDto {
  itemId: number;
  title: string;
  averageStars: number;
  voteCount: number;
  bayesianAiScore: number;
  aiBadge: string;
}

interface AiRankingResponse {
  totalRatings: number;
  globalAverageStars: number;
  rankings: AiRankDto[];
  aiModelSummary: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styleUrl: '../../admin.scss',
  template: `
    <h1 class="admin-title">Dashboard</h1>
    <p class="admin-subtitle">Estado general y métricas de Inteligencia Artificial Local de La Bumanguesa</p>

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

      <!-- SECCIÓN IA RANKING & METRICAS DE CALIFICACIÓN -->
      <div class="stat-card" style="margin-top: 1.5rem">
        <div class="stat-card__label" style="color: #FFD700">🤖 Ranking de Popularidad por IA Local (Bayesiano)</div>
        <div class="stat-card__meta" style="margin-top: 0.5rem">
          Total de calificaciones: <strong>{{ totalRatings() }}</strong> · Promedio global:
          <strong>{{ globalAvg() }} ⭐</strong>
        </div>

        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem">
          @for (item of topAiRankings(); track item.itemId) {
            <div style="display: flex; justify-content: space-between; align-items: center; background: #1a1a20; padding: 10px 14px; border-radius: 8px; border: 1px solid #333">
              <span><strong>{{ item.title }}</strong></span>
              <span>{{ item.aiBadge }} ({{ item.averageStars }} ⭐ · {{ item.voteCount }} votos)</span>
            </div>
          }
        </div>
      </div>

      <div class="stat-card" style="margin-top: 1.5rem">
        <div class="stat-card__label">Configuración del sitio y Yape/Plin</div>
        <div class="stat-card__meta" style="margin-top:0.5rem">
          Marca: <strong>{{ brand() }}</strong> · Barra promo:
          <strong>{{ promoBar() ? 'visible' : 'oculta' }}</strong>
        </div>
        <a class="btn btn-ghost btn-sm" routerLink="/admin/site" style="margin-top:0.9rem; display:inline-block">
          Editar configuración y Yape/Plin QR
        </a>
      </div>
    }
  `,
})
export class Dashboard {
  private readonly api = inject(AdminApiService);
  private readonly http = inject(HttpClient);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly stats = signal<ResourceStat[]>([]);
  protected readonly brand = signal('—');
  protected readonly promoBar = signal(false);

  protected readonly totalRatings = signal(0);
  protected readonly globalAvg = signal(5.0);
  protected readonly topAiRankings = signal<AiRankDto[]>([]);

  constructor() {
    forkJoin({
      menu: this.api.menuList(),
      videos: this.api.videoList(),
      locations: this.api.locationList(),
      hero: this.api.heroList(),
      config: this.api.siteConfigGet(),
      aiRank: this.http.get<AiRankingResponse>(`${API_BASE}/ratings/ranking`),
    }).subscribe({
      next: ({ menu, videos, locations, hero, config, aiRank }) => {
        this.stats.set([
          { label: 'Menú', link: '/admin/menu', total: menu.length, active: menu.filter((x) => x.active).length },
          { label: 'Videos', link: '/admin/videos', total: videos.length, active: videos.filter((x) => x.active).length },
          { label: 'Sedes', link: '/admin/locations', total: locations.length, active: locations.filter((x) => x.active).length },
          { label: 'Hero', link: '/admin/hero', total: hero.length, active: hero.filter((x) => x.active).length },
        ]);
        this.brand.set(config.brand);
        this.promoBar.set(config.showPromoBar);

        if (aiRank) {
          this.totalRatings.set(aiRank.totalRatings);
          this.globalAvg.set(aiRank.globalAverageStars);
          this.topAiRankings.set(aiRank.rankings.slice(0, 5));
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las métricas. ¿El backend está en ejecución?');
        this.loading.set(false);
      },
    });
  }
}
