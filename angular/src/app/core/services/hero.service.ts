import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api.config';
import type { HeroSlide } from '../models/hero-slide.model';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpClient);
  private readonly slides = signal<HeroSlide[]>([]);

  readonly list = this.slides.asReadonly();

  constructor() {
    this.reload();
  }

  reload(): void {
    this.http.get<HeroSlide[]>(`${API_BASE}/hero-slides`).subscribe({
      next: (slides) => this.slides.set(slides),
      error: () => this.slides.set([]),
    });
  }
}
