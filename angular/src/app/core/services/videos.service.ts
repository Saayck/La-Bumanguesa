import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api.config';
import type { VideoCard } from '../models/video.model';

@Injectable({ providedIn: 'root' })
export class VideosService {
  private readonly http = inject(HttpClient);
  private readonly items = signal<VideoCard[]>([]);

  readonly list = this.items.asReadonly();

  constructor() {
    this.reload();
  }

  reload(): void {
    this.http.get<VideoCard[]>(`${API_BASE}/videos`).subscribe({
      next: (items) => this.items.set(items),
      error: () => this.items.set([]),
    });
  }
}
