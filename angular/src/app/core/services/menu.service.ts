import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api.config';
import type { MenuItem } from '../models/menu-item.model';

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    title: 'Bumanguesa',
    description: 'Doble carne de res, tocineta, salchicha ahumada, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 32.00',
    badgeRotation: 3,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '2',
    title: 'Clásica',
    description: 'Carne de res, cebolla caramelizada, papas al hilo, salsa de la casa, lechuga y tomate en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 16.00',
    badgeRotation: -2,
    accent: 'green',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '3',
    title: 'Sencilla',
    description: 'Carne de res, jamón, mix de quesos, cebolla caramelizada, lechuga, tomate, papitas al hilo y salsa de la casa en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 20.00',
    badgeRotation: 2,
    accent: 'pink',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '4',
    title: 'Royal',
    description: 'Carne de res, huevo, mix de quesos, lechuga, tomate, tocineta y salsa de la casa en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 24.00',
    badgeRotation: -3,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '5',
    title: 'Americana',
    description: 'Doble filete de pollo, tocineta, mix de quesos, lechuga, tomate, papitas al hilo y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 25.00',
    badgeRotation: 3,
    accent: 'green',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '6',
    title: 'Mixta',
    description: 'Carne de res, pollo deshilachado, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 26.00',
    badgeRotation: -2,
    accent: 'pink',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '7',
    title: 'Hawaiiana',
    description: 'Carne de res, rodaja de piña, jamón, mix de quesos, tocineta, lechuga, tomate, papitas al hilo y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 27.00',
    badgeRotation: 2,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '8',
    title: 'Bacon',
    description: 'Carne de res, tocineta, chorizo, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 27.00',
    badgeRotation: -3,
    accent: 'pink',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '9',
    title: 'Poderosa',
    description: 'Carne de res, filete de pollo, jamón, tocineta, mix de quesos, lechuga, tomate, papitas al hilo y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 27.00',
    badgeRotation: 3,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '10',
    title: 'Reina',
    description: 'Carne de res, tocineta, salchicha ahumada, mix de quesos, lechuga, tomate y cebolla blanca en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 28.00',
    badgeRotation: -2,
    accent: 'green',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '11',
    title: 'Queen Cheese',
    description: 'Carne de res, tocineta, queso philadelphia, cebolla caramelizada, baño de queso, coronada de maíz dulce y papas al hilo en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 30.00',
    badgeRotation: 2,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '12',
    title: 'Chicken Crispy',
    description: 'Carne de res, filete de pollo apanado, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 30.00',
    badgeRotation: -3,
    accent: 'green',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '13',
    title: 'Choricarne',
    description: 'Carne de res, chorizo, madurito, mix de quesos, lechuga, tomate, carne deshilachada y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
    imageUrl: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 32.00',
    badgeRotation: 3,
    accent: 'pink',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '14',
    title: 'American (Burger Americana)',
    description: 'Doble carne de res (160g), mix de queso, mix de tocineta, cebolla en aro blanca, pepino, lechuga, tomate, salsa de la casa y queso crema en pan brioche.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 32.00',
    badgeRotation: -2,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '15',
    title: 'American Bacon (Burger Americana)',
    description: 'Doble carne de res (160g), doble cheddar, doble mozzarella, doble tocineta, cebolla crispy en aro y queso crema en pan brioche.',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 32.00',
    badgeRotation: 2,
    accent: 'pink',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '16',
    title: 'Oklahoma (Burger Americana)',
    description: 'Doble carne de res (160g), doble cheddar, mozzarella, cebolla en salsa de tocineta, smoked bacon, salsa de la casa y queso crema en pan brioche.',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 32.00',
    badgeRotation: -3,
    accent: 'yellow',
    ctaLabel: 'Pedir por WhatsApp',
  },
  {
    id: '17',
    title: 'Fantasti Burger (Burger Americana)',
    description: 'Carne de res, mix de quesos, carne desmechada, pollo desmechado en tártara, queso crema, tocineta, tomate y lechuga en pan brioche.',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    badge: 'S/ 32.00',
    badgeRotation: 3,
    accent: 'green',
    ctaLabel: 'Pedir por WhatsApp',
  },
];

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly items = signal<MenuItem[]>(DEFAULT_MENU_ITEMS);

  readonly list = this.items.asReadonly();

  constructor() {
    this.reload();
  }

  reload(): void {
    this.http.get<MenuItem[]>(`${API_BASE}/menu-items`).subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.items.set(items);
        }
      },
      error: () => {
        // Mantiene DEFAULT_MENU_ITEMS si el backend no ha cargado aún
      },
    });
  }
}
