import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../core/config/api.config';
import { MenuExtrasService } from '../../../core/services/menu-extras.service';
import type { MenuItem } from '../../../core/models/menu-item.model';

export type PaymentMethod = 'yape' | 'cash';
export type OrderStep = 'order' | 'rating' | 'thankyou';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-modal.html',
  styleUrl: './order-modal.scss',
})
export class OrderModal {
  private readonly http = inject(HttpClient);

  /**
   * Misma fuente que la sección "Arma tu burger". Antes eran dos listas
   * hardcodeadas distintas: la página ofrecía 24 adicionales y aquí solo se
   * podían pedir 7.
   */
  protected readonly availableExtras = inject(MenuExtrasService).list;

  /**
   * Todos estos datos llegan desde `GET /api/site-config` (ver `MenuSection`).
   * No se hardcodean aquí: el número y el QR se editan desde `/admin/site`.
   */
  @Input({ required: true }) item!: MenuItem;
  @Input() waNumber = '';
  @Input() yapeQrUrl = '';
  @Input() yapeNumber = '';
  @Input() yapeHolder = '';
  @Input() takeawayFee = 1.00;

  @Output() close = new EventEmitter<void>();

  protected step = signal<OrderStep>('order');
  protected quantity = signal<number>(1);
  protected paymentMethod = signal<PaymentMethod>('yape');
  protected isTakeaway = signal<boolean>(false);
  protected selectedRating = signal<number>(5);
  protected userComment = signal<string>('');
  protected ratingSubmitted = signal<boolean>(false);


  protected selectedExtras = signal<string[]>([]);

  protected toggleExtra(extraName: string): void {
    const current = this.selectedExtras();
    if (current.includes(extraName)) {
      this.selectedExtras.set(current.filter((e) => e !== extraName));
    } else {
      this.selectedExtras.set([...current, extraName]);
    }
  }

  protected parseBasePrice(): number {
    const num = parseFloat(this.item.badge.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 25 : num;
  }

  protected calculateTotal(): number {
    const base = this.parseBasePrice();
    const extras = this.availableExtras();
    const extrasCost = this.selectedExtras().reduce((acc, name) => {
      const found = extras.find((e) => e.name === name);
      return acc + (found ? found.price : 0);
    }, 0);

    const takeawayCost = this.isTakeaway() ? this.takeawayFee : 0;
    return (base + extrasCost + takeawayCost) * this.quantity();
  }

  protected confirmOrder(): void {
    const qty = this.quantity();
    const total = this.calculateTotal().toFixed(2);
    const method = this.paymentMethod() === 'yape' ? 'Yape / Plin' : 'Contra entrega (Efectivo/Tarjeta)';
    const takeaway = this.isTakeaway() ? `Para llevar (+S/ ${this.takeawayFee.toFixed(2)})` : 'Delivery';
    const extrasText = this.selectedExtras().length > 0 ? `\n- Adicionales: ${this.selectedExtras().join(', ')}` : '';

    const lines = [
      '¡Hola La Bumanguesa! Deseo hacer un pedido:',
      '',
      `- Producto: ${qty}x ${this.item.title} (${this.item.badge})`,
      `- Tipo: ${takeaway}${extrasText}`,
      `- Método de pago: ${method}`,
      '',
      `*Total a pagar: S/ ${total}*`
    ];

    if (this.waNumber) {
      const text = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://api.whatsapp.com/send?phone=${this.waNumber}&text=${text}`;
      window.open(waUrl, '_blank');
    }

    // Move to rating step
    this.step.set('rating');
  }

  protected submitRating(): void {
    const stars = this.selectedRating();
    const comment = this.userComment();
    const itemId = this.item.itemId;

    this.http
      .post(`${API_BASE}/ratings`, { itemId, stars, comment })
      .subscribe({
        next: () => {
          this.ratingSubmitted.set(true);
          this.step.set('thankyou');
        },
        error: () => {
          this.step.set('thankyou');
        },
      });
  }

  protected closeModal(): void {
    this.close.emit();
  }
}
