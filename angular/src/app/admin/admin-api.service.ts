import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../core/config/api.config';
import type { SiteConfig } from '../core/config/site.config';
import type {
  HeroSlideDto,
  HeroSlidePayload,
  LocationDto,
  LocationPayload,
  MenuItemDto,
  MenuItemPayload,
  SiteConfigPayload,
  VideoDto,
  VideoPayload,
} from './models';

/** Single entry point for every admin (CRUD) call against the backend. */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_BASE}/admin`;

  // ---- Menu ----------------------------------------------------------
  menuList(): Observable<MenuItemDto[]> {
    return this.http.get<MenuItemDto[]>(`${this.base}/menu-items`);
  }
  menuCreate(payload: MenuItemPayload): Observable<MenuItemDto> {
    return this.http.post<MenuItemDto>(`${this.base}/menu-items`, payload);
  }
  menuUpdate(slug: string, payload: MenuItemPayload): Observable<MenuItemDto> {
    return this.http.put<MenuItemDto>(`${this.base}/menu-items/${slug}`, payload);
  }
  menuDelete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/menu-items/${slug}`);
  }

  // ---- Videos --------------------------------------------------------
  videoList(): Observable<VideoDto[]> {
    return this.http.get<VideoDto[]>(`${this.base}/videos`);
  }
  videoCreate(payload: VideoPayload): Observable<VideoDto> {
    return this.http.post<VideoDto>(`${this.base}/videos`, payload);
  }
  videoUpdate(slug: string, payload: VideoPayload): Observable<VideoDto> {
    return this.http.put<VideoDto>(`${this.base}/videos/${slug}`, payload);
  }
  videoDelete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/videos/${slug}`);
  }

  // ---- Locations -----------------------------------------------------
  locationList(): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(`${this.base}/locations`);
  }
  locationCreate(payload: LocationPayload): Observable<LocationDto> {
    return this.http.post<LocationDto>(`${this.base}/locations`, payload);
  }
  locationUpdate(slug: string, payload: LocationPayload): Observable<LocationDto> {
    return this.http.put<LocationDto>(`${this.base}/locations/${slug}`, payload);
  }
  locationDelete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/locations/${slug}`);
  }

  // ---- Hero slides ---------------------------------------------------
  heroList(): Observable<HeroSlideDto[]> {
    return this.http.get<HeroSlideDto[]>(`${this.base}/hero-slides`);
  }
  heroCreate(payload: HeroSlidePayload): Observable<HeroSlideDto> {
    return this.http.post<HeroSlideDto>(`${this.base}/hero-slides`, payload);
  }
  heroUpdate(id: number, payload: HeroSlidePayload): Observable<HeroSlideDto> {
    return this.http.put<HeroSlideDto>(`${this.base}/hero-slides/${id}`, payload);
  }
  heroDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/hero-slides/${id}`);
  }

  // ---- Site config ---------------------------------------------------
  siteConfigGet(): Observable<SiteConfig> {
    return this.http.get<SiteConfig>(`${API_BASE}/site-config`);
  }
  siteConfigUpdate(payload: SiteConfigPayload): Observable<SiteConfig> {
    return this.http.put<SiteConfig>(`${API_BASE}/site-config`, payload);
  }
}
