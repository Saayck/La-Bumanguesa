import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api.config';
import type { Location } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly http = inject(HttpClient);
  private readonly items = signal<Location[]>([]);

  readonly list = this.items.asReadonly();

  constructor() {
    this.reload();
  }

  reload(): void {
    this.http.get<Location[]>(`${API_BASE}/locations`).subscribe({
      next: (items) => this.items.set(items),
      error: () => this.items.set([]),
    });
  }
}
