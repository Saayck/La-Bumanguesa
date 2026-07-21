import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api.config';
import type { SiteConfig } from '../config/site.config';

export type SiteConfigStatus = 'loading' | 'ready' | 'error';

/**
 * Loads the site configuration from the API and exposes it as a signal.
 * The value is `null` until the backend responds — nothing is hardcoded here.
 * {@link status} lets the UI show a loading splash or an error/retry state.
 */
@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  private readonly http = inject(HttpClient);
  private readonly _config = signal<SiteConfig | null>(null);
  private readonly _status = signal<SiteConfigStatus>('loading');

  readonly config = this._config.asReadonly();
  readonly status = this._status.asReadonly();

  constructor() {
    this.reload();
  }

  reload(): void {
    this._status.set('loading');
    this.http.get<SiteConfig>(`${API_BASE}/site-config`).subscribe({
      next: (cfg) => {
        this._config.set(cfg);
        this._status.set('ready');
      },
      error: () => {
        this._config.set(null);
        this._status.set('error');
      },
    });
  }
}
