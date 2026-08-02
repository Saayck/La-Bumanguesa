import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../admin-api.service';
import { AiAdminService, type AiInsightsResponse } from '../../ai-admin.service';
import { API_BASE } from '../../../core/config/api.config';

interface ResourceStat {
  label: string;
  icon: string;
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
    <h1 class="admin-title">Dashboard General</h1>
    <p class="admin-subtitle">Métricas del sistema, gestión de contenidos e Inteligencia Artificial Local de La Bumanguesa</p>

    @if (loading()) {
      <div class="empty">Cargando dashboard y métricas…</div>
    } @else if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    } @else {
      <!-- MÉTRICAS CLAVE / KPI CARDS -->
      <div class="stat-grid">
        @for (s of stats(); track s.label) {
          <a class="stat-card" [routerLink]="s.link" style="text-decoration:none; color:inherit">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <span class="stat-card__label">{{ s.label }}</span>
              <span style="font-size: 1.4rem">{{ s.icon }}</span>
            </div>
            <div class="stat-card__value">{{ s.total }}</div>
            <div class="stat-card__meta">
              <strong style="color: var(--admin-green)">{{ s.active }} activos</strong> · {{ s.total - s.active }} ocultos
            </div>
          </a>
        }
      </div>

      <!-- PANEL IA LOCAL: RANKING DE POPULARIDAD BAYESIANO -->
      <div class="dashboard-section">
        <div class="dashboard-section__header">
          <div>
            <h2 class="dashboard-section__title">
              <span>🤖</span> Ranking de Popularidad por IA Local (Algoritmo Bayesiano)
            </h2>
            <p class="dashboard-section__desc">
              Clasificación ponderada según valoraciones del cliente de 1 a 5 estrellas y suavizado estadístico.
            </p>
          </div>
          <div style="text-align: right">
            <div style="font-size: 1.3rem; font-weight: 900; color: var(--admin-yellow)">
              {{ globalAvg() }} ⭐
            </div>
            <div style="font-size: 0.8rem; color: var(--admin-muted)">
              {{ totalRatings() }} valoraciones recibidas
            </div>
          </div>
        </div>

        <div class="ranking-list">
          @for (item of topAiRankings(); track item.itemId; let idx = $index) {
            <div class="ranking-item">
              <div class="ranking-item__left">
                <div class="ranking-item__pos">#{{ idx + 1 }}</div>
                <div class="ranking-item__name">{{ item.title }}</div>
              </div>

              <div class="ranking-item__right">
                <span class="ranking-item__badge">{{ item.aiBadge }}</span>
                <span class="ranking-item__stars">{{ item.averageStars }} ⭐ ({{ item.voteCount }} votos)</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- PANEL IA: LECTURA DE OPINIONES DE CLIENTES -->
      <div class="dashboard-section">
        <div class="dashboard-section__header">
          <div>
            <h2 class="dashboard-section__title">
              <span>💬</span> Qué dicen los clientes (análisis por IA)
            </h2>
            <p class="dashboard-section__desc">
              Lectura automática de los comentarios más recientes, en fortalezas y oportunidades de mejora.
            </p>
          </div>
          <button class="btn btn-primary" [disabled]="insightsLoading()" (click)="loadInsights()">
            {{ insightsLoading() ? 'Analizando…' : '🔍 Analizar opiniones' }}
          </button>
        </div>

        @if (insightsError()) {
          <div class="alert alert-error">{{ insightsError() }}</div>
        } @else if (insights(); as data) {
          <p style="color: var(--admin-muted); font-size: 0.8rem; margin: 0 0 0.75rem">
            {{ data.analyzedComments }} comentarios analizados
          </p>
          <p style="color: #fff; line-height: 1.6; margin: 0 0 1.25rem">{{ data.summary }}</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem">
            <div style="background: var(--admin-panel-2); padding: 1.25rem; border-radius: 14px; border: 1px solid var(--admin-border-soft)">
              <h3 style="margin: 0 0 0.75rem; font-size: 0.85rem; text-transform: uppercase; color: var(--admin-green)">
                ✅ Lo que más gusta
              </h3>
              <ul style="margin: 0; padding-left: 1.1rem; color: #fff; line-height: 1.8">
                @for (item of data.strengths; track item) {
                  <li>{{ item }}</li>
                } @empty {
                  <li style="color: var(--admin-muted)">Sin datos suficientes.</li>
                }
              </ul>
            </div>
            <div style="background: var(--admin-panel-2); padding: 1.25rem; border-radius: 14px; border: 1px solid var(--admin-border-soft)">
              <h3 style="margin: 0 0 0.75rem; font-size: 0.85rem; text-transform: uppercase; color: var(--admin-yellow)">
                ⚡ Oportunidades de mejora
              </h3>
              <ul style="margin: 0; padding-left: 1.1rem; color: #fff; line-height: 1.8">
                @for (item of data.improvements; track item) {
                  <li>{{ item }}</li>
                } @empty {
                  <li style="color: var(--admin-muted)">Sin datos suficientes.</li>
                }
              </ul>
            </div>
          </div>
        } @else {
          <div class="empty">
            Pulsa «Analizar opiniones» para que la IA lea los comentarios más recientes.
          </div>
        }
      </div>

      <!-- PANEL DE CONFIGURACIÓN RÁPIDA DE SITIO & YAPE/PLIN -->
      <div class="dashboard-section">
        <div class="dashboard-section__header">
          <div>
            <h2 class="dashboard-section__title" style="color: #fff">
              <span>⚙️</span> Configuración de Marca y Yape / Plin
            </h2>
            <p class="dashboard-section__desc">
              Personalización de la marca <strong>{{ brand() }}</strong>, teléfono WhatsApp y código QR de Yape/Plin.
            </p>
          </div>
          <a class="btn btn-primary" routerLink="/admin/site">
            <span>✏️ Editar Configuración</span>
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; background: var(--admin-panel-2); padding: 1.25rem; border-radius: 14px; border: 1px solid var(--admin-border-soft)">
          <div>
            <div style="font-size: 0.8rem; color: var(--admin-muted); text-transform: uppercase">Marca / Ciudad</div>
            <div style="font-weight: 700; color: #fff; margin-top: 4px">{{ brand() }}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--admin-muted); text-transform: uppercase">Barra de Anuncios</div>
            <div style="font-weight: 700; color: #fff; margin-top: 4px">
              <span class="badge-pill" [class.badge-on]="promoBar()" [class.badge-off]="!promoBar()">
                {{ promoBar() ? 'ACTIVA' : 'DESACTIVADA' }}
              </span>
            </div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--admin-muted); text-transform: uppercase">Pagos Digitales</div>
            <div style="font-weight: 700; color: var(--admin-green); margin-top: 4px">📱 YAPE / PLIN QR Activo</div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Dashboard {
  private readonly api = inject(AdminApiService);
  private readonly ai = inject(AiAdminService);
  private readonly http = inject(HttpClient);

  protected readonly insights = signal<AiInsightsResponse | null>(null);
  protected readonly insightsLoading = signal(false);
  protected readonly insightsError = signal<string | null>(null);

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
          { label: 'Hamburguesas & Menú', icon: '🍔', link: '/admin/menu', total: menu.length, active: menu.filter((x) => x.active).length },
          { label: 'Videos Sociales', icon: '🎬', link: '/admin/videos', total: videos.length, active: videos.filter((x) => x.active).length },
          { label: 'Sedes & Mapas', icon: '📍', link: '/admin/locations', total: locations.length, active: locations.filter((x) => x.active).length },
          { label: 'Diapositivas Hero', icon: '🖼️', link: '/admin/hero', total: hero.length, active: hero.filter((x) => x.active).length },
        ]);
        this.brand.set(config.brand);
        this.promoBar.set(config.showPromoBar);

        if (aiRank) {
          this.totalRatings.set(aiRank.totalRatings);
          this.globalAvg.set(aiRank.globalAverageStars);
          this.topAiRankings.set(aiRank.rankings.slice(0, 6));
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las métricas. ¿El backend está en ejecución?');
        this.loading.set(false);
      },
    });
  }

  /** Bajo demanda: la inferencia consume CPU, no se lanza al abrir el dashboard. */
  protected loadInsights(): void {
    this.insightsLoading.set(true);
    this.insightsError.set(null);

    this.ai.insights().subscribe({
      next: (data) => {
        this.insights.set(data);
        this.insightsLoading.set(false);
      },
      error: (err: Error) => {
        this.insightsError.set(err.message);
        this.insightsLoading.set(false);
      },
    });
  }
}
