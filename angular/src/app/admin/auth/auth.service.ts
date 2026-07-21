import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE } from '../../core/config/api.config';

export interface LoginResponse {
  token: string;
  tokenType: string;
  username: string;
  role: string;
  expiresInMs: number;
}

const TOKEN_KEY = 'lb_admin_token';
const USER_KEY = 'lb_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _username = signal<string | null>(localStorage.getItem(USER_KEY));

  readonly token = this._token.asReadonly();
  readonly username = this._username.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE}/auth/login`, { username, password })
      .pipe(tap((res) => this.setSession(res)));
  }

  logout(redirect = true): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._username.set(null);
    if (redirect) {
      this.router.navigate(['/admin/login']);
    }
  }

  private setSession(res: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, res.username);
    this._token.set(res.token);
    this._username.set(res.username);
  }
}
