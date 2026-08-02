import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../../core/services/menu.service';
import { SiteConfigService } from '../../../core/services/site-config.service';
import { WhatsappService } from '../../../core/services/whatsapp.service';
import { MenuCard } from '../menu-card/menu-card';
import { OrderModal } from '../order-modal/order-modal';
import { AiRecommender } from '../../ai/ai-recommender/ai-recommender';
import { SectionTitle } from '../../../shared/components/section-title/section-title';
import { API_BASE } from '../../../core/config/api.config';
import type { MenuItem } from '../../../core/models/menu-item.model';

export type MenuCategory = 'popular' | 'clasicas' | 'americanas' | 'extras';

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
  imports: [MenuCard, OrderModal, SectionTitle, AiRecommender],
  templateUrl: './menu-section.html',
  styleUrl: './menu-section.scss',
})
export class MenuSection implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly menu = inject(MenuService);
  private readonly whatsapp = inject(WhatsappService);
  private readonly site = inject(SiteConfigService);

  protected readonly activeTab = signal<MenuCategory>('popular');
  protected readonly items = this.menu.list;
  protected readonly waLink = this.whatsapp.link;
  protected readonly selectedOrder = signal<MenuItem | null>(null);
  protected readonly aiRankings = signal<AiRankDto[]>([]);

  /** Datos de contacto y cobro que el modal de pedido necesita (vienen de la BD). */
  protected readonly waNumber = computed(() => this.site.config()?.whatsappNumber ?? '');
  protected readonly yapeQrUrl = computed(() => this.site.config()?.payment?.yapeQrUrl ?? '');
  protected readonly yapeNumber = computed(() => this.site.config()?.payment?.yapeNumber ?? '');
  protected readonly yapeHolder = computed(() => this.site.config()?.payment?.yapeHolder ?? '');

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
        // Se respeta el orden del ranking bayesiano, no el orden de la carta.
        const byId = new Map(all.map((item) => [item.itemId, item]));
        const matched = ranks
          .slice(0, 6)
          .map((rank) => byId.get(rank.itemId))
          .filter((item): item is MenuItem => item !== undefined);
        if (matched.length > 0) return matched;
      }
      return all.filter((item) =>
        ['Bumanguesa', 'Royal', 'Queen Cheese', 'American Bacon (Burger Americana)', 'Oklahoma (Burger Americana)', 'Choricarne'].includes(item.title)
      );
    }

    if (category === 'americanas') {
      return all.filter(
        (item) =>
          item.title.includes('(Burger Americana)') ||
          item.title.toLowerCase().includes('american') ||
          item.title.toLowerCase().includes('oklahoma') ||
          item.title.toLowerCase().includes('fantasti')
      );
    }

    if (category === 'clasicas') {
      return all.filter((item) => !item.title.includes('(Burger Americana)'));
    }

    return all;
  });

  protected selectTab(tab: MenuCategory): void {
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

  protected readonly extras = [
    { name: 'Carne de Hamburguesa', price: 'S/ 8.00' },
    { name: 'Carne Deshilachada', price: 'S/ 8.00' },
    { name: 'Pollo Deshilachado', price: 'S/ 8.00' },
    { name: 'Filete de Pollo', price: 'S/ 10.00' },
    { name: 'Costillas de Cerdo', price: 'S/ 12.00' },
    { name: 'Chicharrón (2 und)', price: 'S/ 12.00' },
    { name: 'Alitas (3 und)', price: 'S/ 12.00' },
    { name: 'Baño en Queso Mozarella', price: 'S/ 10.00' },
    { name: 'Salchicha Ahumada', price: 'S/ 6.00' },
    { name: 'Aros de Cebolla', price: 'S/ 6.00' },
    { name: 'Maíz Dulce', price: 'S/ 7.00' },
    { name: 'Queso Paria', price: 'S/ 4.50' },
    { name: 'Guacamole', price: 'S/ 3.00' },
    { name: 'Chorizo', price: 'S/ 3.00' },
    { name: 'Tocineta', price: 'S/ 3.00' },
    { name: 'Plátano Maduro', price: 'S/ 3.00' },
    { name: 'Salsa BBQ', price: 'S/ 3.00' },
    { name: 'Queso Cheddar', price: 'S/ 3.00' },
    { name: 'Huevo', price: 'S/ 2.00' },
    { name: 'Huevo de Codorniz', price: 'S/ 2.00' },
    { name: 'Jamón', price: 'S/ 1.00' },
    { name: 'Porción de Papas', price: 'S/ 8.00' },
    { name: 'Nachos', price: 'S/ 4.00' },
    { name: 'Rodaja de Piña', price: 'S/ 3.00' },
  ];
}
