import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../core/config/api.config';
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

  @Input({ required: true }) item!: MenuItem;
  @Input() waNumber = '51989451473';
  @Input() yapeQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YAPE-LA-BUMANGUESA-989451473';
  @Input() yapeNumber = '989 451 473';
  @Input() yapeHolder = 'La Bumanguesa Ica';

  @Output() close = new EventEmitter<void>();

  protected step = signal<OrderStep>('order');
  protected quantity = signal<number>(1);
  protected paymentMethod = signal<PaymentMethod>('yape');
  protected isTakeaway = signal<boolean>(false);
  protected selectedRating = signal<number>(5);
  protected userComment = signal<string>('');
  protected ratingSubmitted = signal<boolean>(false);

  protected readonly availableExtras = [
    { name: 'Tocineta', price: 3 },
    { name: 'Queso Cheddar', price: 3 },
    { name: 'Chorizo', price: 3 },
    { name: 'Huevo', price: 2 },
    { name: 'Aros de Cebolla', price: 6 },
    { name: 'Guacamole', price: 3 },
    { name: 'Porción de Papas Extra', price: 8 },
  ];

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
    const extrasCost = this.selectedExtras().reduce((acc, name) => {
      const found = this.availableExtras.find((e) => e.name === name);
      return acc + (found ? found.price : 0);
    }, 0);

    const takeawayCost = this.isTakeaway() ? 1 : 0;
    return (base + extrasCost + takeawayCost) * this.quantity();
  }

  protected confirmOrder(): void {
    const qty = this.quantity();
    const total = this.calculateTotal().toFixed(2);
    const method = this.paymentMethod() === 'yape' ? 'Yape / Plin' : 'Contra entrega (Efectivo/Tarjeta)';
    const takeaway = this.isTakeaway() ? 'Para llevar (+S/ 1.00)' : 'Delivery';
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

    const text = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://api.whatsapp.com/send?phone=${this.waNumber}&text=${text}`;
    window.open(waUrl, '_blank');

    // Move to rating step
    this.step.set('rating');
  }

  protected submitRating(): void {
    const stars = this.selectedRating();
    const comment = this.userComment();
    const itemId = parseInt(this.item.id, 10) || 1;

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
