import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from '../config/api.config';
import type { MenuExtra, MenuExtraRequest } from '../models/menu-extra.model';

/**
 * Adicionales de la carta. Se cargan una sola vez y los comparten la sección
 * "Arma tu burger", el modal de pedido y el recomendador.
 */
@Injectable({ providedIn: 'root' })
export class MenuExtrasService {
  private readonly http = inject(HttpClient);

  private readonly _list = signal<MenuExtra[]>([]);
  readonly list = this._list.asReadonly();

  constructor() {
    this.reloadPublic();
  }

  reloadPublic(): void {
    this.http.get<MenuExtra[]>(`${API_BASE}/menu-extras`).subscribe({
      next: (data) => this._list.set(data),
      error: () => this._list.set([]),
    });
  }

  listAllAdmin(): Observable<MenuExtra[]> {
    return this.http.get<MenuExtra[]>(`${API_BASE}/admin/menu-extras`);
  }

  createExtra(request: MenuExtraRequest): Observable<MenuExtra> {
    return this.http.post<MenuExtra>(`${API_BASE}/admin/menu-extras`, request).pipe(
      tap(() => this.reloadPublic())
    );
  }

  updateExtra(id: number, request: MenuExtraRequest): Observable<MenuExtra> {
    return this.http.put<MenuExtra>(`${API_BASE}/admin/menu-extras/${id}`, request).pipe(
      tap(() => this.reloadPublic())
    );
  }

  deleteExtra(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/admin/menu-extras/${id}`).pipe(
      tap(() => this.reloadPublic())
    );
  }
}

