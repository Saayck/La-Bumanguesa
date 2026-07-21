import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <div style="min-height:100vh; display:grid; place-items:center; background:var(--admin-bg); padding:1rem">
      <form class="form-card" style="width:100%; max-width:380px" (ngSubmit)="submit()">
        <div class="admin-sidebar__brand" style="text-align:center; font-size:1.6rem">
          LA BUMANGUESA<span>.</span>
        </div>
        <p class="admin-subtitle" style="text-align:center">Acceso al panel de administración</p>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <div class="field" style="margin-bottom:0.9rem">
          <label for="username">Usuario</label>
          <input id="username" name="username" [(ngModel)]="username" required autocomplete="username" />
        </div>
        <div class="field" style="margin-bottom:0.9rem">
          <label for="password">Contraseña</label>
          <input id="password" name="password" type="password" [(ngModel)]="password"
                 required autocomplete="current-password" />
        </div>

        <button class="btn btn-primary" style="width:100%" type="submit" [disabled]="loading()">
          {{ loading() ? 'Ingresando…' : 'Ingresar' }}
        </button>
      </form>
    </div>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  submit(): void {
    if (!this.username || !this.password) {
      this.error.set('Ingresa usuario y contraseña.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? 'No se pudo iniciar sesión. Verifica tus credenciales.',
        );
      },
    });
  }
}
