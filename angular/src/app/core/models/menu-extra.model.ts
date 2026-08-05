/**
 * Adicional de "Arma tu burger". Fuente única: `GET /api/menu-extras`.
 *
 * Antes vivía duplicado y descuadrado en dos listas hardcodeadas (la sección
 * mostraba 24 y el modal solo dejaba pedir 7).
 */
export interface MenuExtra {
  id: number;
  name: string;
  /** Valor numérico, para sumar el total del pedido. */
  price: number;
  /** El mismo precio ya formateado ("S/ 3.00"), para pintarlo. */
  priceLabel: string;
  orderIndex?: number;
  active?: boolean;
}

export interface MenuExtraRequest {
  name: string;
  price: number;
  orderIndex: number;
  active: boolean;
}

