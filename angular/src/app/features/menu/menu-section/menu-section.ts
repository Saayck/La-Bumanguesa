import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../../core/services/menu.service';
import { MenuExtrasService } from '../../../core/services/menu-extras.service';
import { SiteConfigService } from '../../../core/services/site-config.service';
import { WhatsappService } from '../../../core/services/whatsapp.service';
import { MenuCard } from '../menu-card/menu-card';
import { OrderModal } from '../order-modal/order-modal';
import { AiRecommender } from '../../ai/ai-recommender/ai-recommender';
import { SectionTitle } from '../../../shared/components/section-title/section-title';
import { API_BASE } from '../../../core/config/api.config';
import type { MenuItem } from '../../../core/models/menu-item.model';

export type MenuCategory = 'popular' | 'clasicas' | 'americanas' | 'extras';

import { MenuCategoriesService } from '../../../core/services/menu-categories.service';
import { AppIcon } from '../../../shared/components/icon/icon';

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
  selector: 'app-menu-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuCard, OrderModal, SectionTitle, AiRecommender, AppIcon],
  templateUrl: './menu-section.html',
  styleUrl: './menu-section.scss',
})
export class MenuSection implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly menu = inject(MenuService);
  private readonly whatsapp = inject(WhatsappService);
  private readonly site = inject(SiteConfigService);

  protected readonly categories = inject(MenuCategoriesService).list;
  protected readonly activeTab = signal<string>('popular');
  protected readonly items = this.menu.list;
  protected readonly waLink = this.whatsapp.link;
  protected readonly selectedOrder = signal<MenuItem | null>(null);
  protected readonly aiRankings = signal<AiRankDto[]>([]);
  /** Misma fuente que el modal de pedido y el recomendador. */
  protected readonly extras = inject(MenuExtrasService).list;

  /** Datos de contacto y cobro que el modal de pedido necesita (vienen de la BD). */
  protected readonly waNumber = computed(() => this.site.config()?.whatsappNumber ?? '');
  protected readonly yapeQrUrl = computed(() => this.site.config()?.payment?.yapeQrUrl ?? '');
  protected readonly yapeNumber = computed(() => this.site.config()?.payment?.yapeNumber ?? '');
  protected readonly yapeHolder = computed(() => this.site.config()?.payment?.yapeHolder ?? '');
  protected readonly takeawayFee = computed(() => this.site.config()?.takeawayFee ?? 1.00);
  protected readonly menuTitle = computed(() => this.site.config()?.sectionTitles?.['menu'] ?? { leading: 'Nuestra', highlight: 'Carta', accent: 'gold' });

  ngOnInit(): void {
    this.fetchAiRankings();
  }

  protected fetchAiRankings(): void {
    this.http.get<AiRankingResponse>(`${API_BASE}/ratings/ranking`).subscribe({
      next: (res) => {
        if (res && res.rankings) {
          this.aiRankings.set(res.rankings);
        }
      },
      error: () => {},
    });
  }

  protected readonly filteredItems = computed(() => {
    const category = this.activeTab();
    const all = this.items();
    const ranks = this.aiRankings();

    if (category === 'popular') {
      if (ranks.length > 0) {
        const byId = new Map(all.map((item) => [item.itemId, item]));
        const matched = ranks
          .slice(0, 6)
          .map((rank) => byId.get(rank.itemId))
          .filter((item): item is MenuItem => item !== undefined);
        if (matched.length > 0) return matched;
      }
      return all.slice(0, 6);
    }

    if (category === 'extras') {
      return [];
    }

    return all.filter((item) => {
      if (item.categorySlug) {
        return item.categorySlug === category;
      }
      // Si el item aún no tiene categoría asignada en BD, cae por defecto en clasicas
      return category === 'clasicas';
    });
  });

  protected selectTab(tab: string): void {
    this.activeTab.set(tab);
  }

  protected openOrderModal(item: MenuItem): void {
    this.selectedOrder.set(item);
  }

  /** El recomendador devuelve la clave numérica: se busca el producto y se abre el modal. */
  protected openOrderModalById(itemId: number): void {
    const item = this.items().find((candidate) => candidate.itemId === itemId);
    if (item) {
      this.selectedOrder.set(item);
    }
  }

  protected closeOrderModal(): void {
    this.selectedOrder.set(null);
    this.fetchAiRankings();
  }

}
