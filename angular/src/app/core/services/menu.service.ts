import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api.config';
import type { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly items = signal<MenuItem[]>([]);

  readonly list = this.items.asReadonly();

  constructor() {
    this.reload();
  }

  reload(): void {
    this.http.get<MenuItem[]>(`${API_BASE}/menu-items`).subscribe({
      next: (items) => this.items.set(items),
      error: () => this.items.set([]),
    });
  }
}
