import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: '../../admin.scss',
  template: `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-sidebar__brand">LA BUMANGUESA<span>.</span></div>
        <a class="admin-nav-link" routerLink="/admin" routerLinkActive="active"
           [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a class="admin-nav-link" routerLink="/admin/menu" routerLinkActive="active">Menú</a>
        <a class="admin-nav-link" routerLink="/admin/videos" routerLinkActive="active">Videos</a>
        <a class="admin-nav-link" routerLink="/admin/locations" routerLinkActive="active">Sedes</a>
        <a class="admin-nav-link" routerLink="/admin/hero" routerLinkActive="active">Hero</a>
        <a class="admin-nav-link" routerLink="/admin/site" routerLinkActive="active">Configuración</a>
      </aside>
      <div class="admin-main">
        <header class="admin-topbar">
          <span class="admin-topbar__user">Panel de administración</span>
          <span>
            <span class="admin-topbar__user">👤 {{ username() }}</span>
            <button class="btn btn-ghost btn-sm" style="margin-left: 0.75rem" (click)="logout()">
              Salir
            </button>
          </span>
        </header>
        <main class="admin-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayout {
  private readonly auth = inject(AuthService);
  protected readonly username = this.auth.username;

  logout(): void {
    this.auth.logout();
  }
}
