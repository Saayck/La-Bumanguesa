package com.bumanguesa.api.menu.domain;

import com.bumanguesa.api.common.domain.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un adicional de "Arma tu burger" (tocineta, huevo, aros de cebolla…).
 *
 * <p>El precio es numérico, no un texto tipo {@code "S/ 3.00"} como en
 * {@code MenuItem.badge}: el modal de pedido necesita sumarlo, y el asistente
 * de IA compararlo para recomendar por presupuesto.
 */
@Entity
@Table(name = "menu_extra")
@Getter
@Setter
@NoArgsConstructor
public class MenuExtra extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean active = true;
}
