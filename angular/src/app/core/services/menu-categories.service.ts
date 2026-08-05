import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from '../config/api.config';
import type { MenuCategory, MenuCategoryRequest } from '../models/menu-category.model';

@Injectable({ providedIn: 'root' })
export class MenuCategoriesService {
  private readonly http = inject(HttpClient);

  private readonly _list = signal<MenuCategory[]>([]);
  readonly list = this._list.asReadonly();

  constructor() {
    this.reloadPublic();
  }

  reloadPublic(): void {
    this.http.get<MenuCategory[]>(`${API_BASE}/menu-categories`).subscribe({
      next: (data) => this._list.set(data),
      error: () => this._list.set([]),
    });
  }

  listAllAdmin(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${API_BASE}/admin/menu-categories`);
  }

  createCategory(request: MenuCategoryRequest): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(`${API_BASE}/admin/menu-categories`, request).pipe(
      tap(() => this.reloadPublic())
    );
  }

  updateCategory(slug: string, request: MenuCategoryRequest): Observable<MenuCategory> {
    return this.http.put<MenuCategory>(`${API_BASE}/admin/menu-categories/${slug}`, request).pipe(
      tap(() => this.reloadPublic())
    );
  }

  deleteCategory(slug: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/admin/menu-categories/${slug}`).pipe(
      tap(() => this.reloadPublic())
    );
  }
}
