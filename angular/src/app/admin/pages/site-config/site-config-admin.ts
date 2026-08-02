import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../admin-api.service';
import { AiAdminService } from '../../ai-admin.service';
import { SiteConfigService } from '../../../core/services/site-config.service';
import type { SiteConfigPayload } from '../../models';

function emptyForm(): SiteConfigPayload {
  return {
    brand: '',
    city: '',
    country: '',
    whatsappNumber: '',
    whatsappDisplay: '',
    defaultOrderMessage: '',
    showPromoBar: true,
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    hoursWeekdays: '',
    hoursWeekend: '',
    copyrightYear: new Date().getFullYear(),
    marqueeText: '',
    marqueeDurationSeconds: 22,
    yapeQrUrl: '',
    yapeNumber: '',
    yapeHolder: '',
  };
}

@Component({
  selector: 'app-site-config-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: '../../admin.scss',
  template: `
    <h1 class="admin-title">Configuración del sitio</h1>
    <p class="admin-subtitle">Marca, contacto, redes, horarios y textos de la página</p>

    @if (message()) { <div class="alert alert-ok">{{ message() }}</div> }
    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    @if (loading()) {
      <div class="empty">Cargando…</div>
    } @else {
      <form class="form-card" (ngSubmit)="save()">
        <h3 style="margin-top:0">Marca</h3>
        <div class="form-grid">
          <div class="field"><label>Marca</label><input name="brand" [(ngModel)]="form.brand" required maxlength="80" /></div>
          <div class="field"><label>Ciudad</label><input name="city" [(ngModel)]="form.city" required maxlength="80" /></div>
          <div class="field"><label>País</label><input name="country" [(ngModel)]="form.country" required maxlength="80" /></div>
          <div class="field"><label>Año copyright</label><input name="copyrightYear" type="number" min="2000" max="2100" [(ngModel)]="form.copyrightYear" required /></div>
        </div>

        <h3>WhatsApp</h3>
        <div class="form-grid">
          <div class="field">
            <label>Número (solo dígitos)</label>
            <input name="whatsappNumber" [(ngModel)]="form.whatsappNumber" required pattern="\\d{8,15}" />
            <span class="hint">incluye código de país, ej: 51989451473</span>
          </div>
          <div class="field"><label>Número visible</label><input name="whatsappDisplay" [(ngModel)]="form.whatsappDisplay" required maxlength="40" /></div>
        </div>
        <div class="field" style="margin-top:1rem">
          <label>Mensaje de pedido por defecto</label>
          <textarea name="defaultOrderMessage" [(ngModel)]="form.defaultOrderMessage" required maxlength="500"></textarea>
        </div>

        <h3>Redes y barra de promoción</h3>
        <div class="form-grid">
          <div class="field"><label>Facebook URL</label><input name="facebookUrl" [(ngModel)]="form.facebookUrl" required maxlength="500" /></div>
          <div class="field"><label>Instagram URL</label><input name="instagramUrl" [(ngModel)]="form.instagramUrl" required maxlength="500" /></div>
          <div class="field"><label>TikTok URL</label><input name="tiktokUrl" [(ngModel)]="form.tiktokUrl" required maxlength="500" /></div>
          <div class="field field-check">
            <input id="promo" name="showPromoBar" type="checkbox" [(ngModel)]="form.showPromoBar" />
            <label for="promo">Mostrar barra de promoción</label>
          </div>
        </div>

        <h3>Horarios</h3>
        <div class="form-grid">
          <div class="field"><label>Lunes a Jueves</label><input name="hoursWeekdays" [(ngModel)]="form.hoursWeekdays" required maxlength="60" /></div>
          <div class="field"><label>Viernes a Domingo</label><input name="hoursWeekend" [(ngModel)]="form.hoursWeekend" required maxlength="60" /></div>
        </div>

        <h3>Marquesina (texto animado)</h3>
        <div class="field">
          <label>
            Texto
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              style="margin-left:.5rem"
              [disabled]="generating()"
              (click)="generateMarquee()"
            >
              {{ generating() ? '✨ Redactando…' : '✨ Generar con IA' }}
            </button>
          </label>
          <textarea name="marqueeText" [(ngModel)]="form.marqueeText" required maxlength="500"></textarea>
        </div>
        <div class="form-grid" style="margin-top:1rem">
          <div class="field">
            <label>Duración (seg, 5-120)</label>
            <input name="marqueeDurationSeconds" type="number" min="5" max="120" [(ngModel)]="form.marqueeDurationSeconds" required />
          </div>
        </div>

        <h3>Pagos digitales (Yape / Plin)</h3>
        <p class="hint" style="margin:-0.5rem 0 1rem">
          Estos datos son los que ve el cliente en el modal de pedido al elegir “Yape / Plin”.
        </p>
        <div class="form-grid">
          <div class="field">
            <label>Número Yape/Plin</label>
            <input name="yapeNumber" [(ngModel)]="form.yapeNumber" maxlength="40" />
            <span class="hint">tal como se muestra, ej: 989 451 473</span>
          </div>
          <div class="field">
            <label>Titular de la cuenta</label>
            <input name="yapeHolder" [(ngModel)]="form.yapeHolder" maxlength="120" />
          </div>
        </div>
        <div class="field" style="margin-top:1rem">
          <label>URL del código QR</label>
          <input name="yapeQrUrl" [(ngModel)]="form.yapeQrUrl" maxlength="500" />
          <span class="hint">imagen pública del QR (http/https)</span>
        </div>
        @if (form.yapeQrUrl) {
          <img
            [src]="form.yapeQrUrl"
            alt="Vista previa del QR de Yape/Plin"
            style="margin-top:1rem; width:150px; height:150px; object-fit:contain; background:#fff; border-radius:12px; padding:8px"
          />
        }

        <div class="form-actions">
          <button class="btn btn-primary" type="submit" [disabled]="saving()">
            {{ saving() ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    }
  `,
})
export class SiteConfigAdmin {
  private readonly api = inject(AdminApiService);
  private readonly ai = inject(AiAdminService);
  private readonly siteConfig = inject(SiteConfigService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly generating = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected form: SiteConfigPayload = emptyForm();

  constructor() {
    this.api.siteConfigGet().subscribe({
      next: (cfg) => {
        this.form = {
          brand: cfg.brand,
          city: cfg.city,
          country: cfg.country,
          whatsappNumber: cfg.whatsappNumber,
          whatsappDisplay: cfg.whatsappDisplay,
          defaultOrderMessage: cfg.defaultOrderMessage,
          showPromoBar: cfg.showPromoBar,
          facebookUrl: cfg.facebookUrl,
          instagramUrl: cfg.instagramUrl,
          tiktokUrl: cfg.tiktokUrl,
          hoursWeekdays: cfg.hours.weekdays,
          hoursWeekend: cfg.hours.weekend,
          copyrightYear: cfg.copyrightYear,
          marqueeText: cfg.marquee.text,
          marqueeDurationSeconds: cfg.marquee.durationSeconds,
          yapeQrUrl: cfg.payment?.yapeQrUrl ?? '',
          yapeNumber: cfg.payment?.yapeNumber ?? '',
          yapeHolder: cfg.payment?.yapeHolder ?? '',
        };
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la configuración.');
        this.loading.set(false);
      },
    });
  }

  /** Redacta la marquesina con la IA usando el contexto real del negocio. */
  generateMarquee(): void {
    this.generating.set(true);
    this.error.set(null);
    this.message.set(null);

    const brief = this.form.marqueeText
      ? `Mejora este texto manteniendo el mensaje: ${this.form.marqueeText}`
      : 'Crea una marquesina destacando las hamburguesas y el delivery.';

    this.ai.generateContent('MARQUEE', brief).subscribe({
      next: (res) => {
        this.form.marqueeText = res.text;
        this.generating.set(false);
        this.message.set('Marquesina generada. Revísala y guarda si te convence.');
      },
      error: (err: Error) => {
        this.generating.set(false);
        this.error.set(err.message);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set(null);
    this.message.set(null);
    this.api.siteConfigUpdate(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set('Configuración actualizada.');
        this.siteConfig.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo guardar la configuración.');
      },
    });
  }
}
