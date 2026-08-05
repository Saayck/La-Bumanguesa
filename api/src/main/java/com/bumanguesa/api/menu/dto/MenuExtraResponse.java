package com.bumanguesa.api.menu.dto;

import java.math.BigDecimal;

/**
 * Adicional tal como lo consumen la carta, el modal de pedido y el recomendador.
 *
 * @param price       valor numérico, para sumar totales
 * @param priceLabel  el mismo precio ya formateado ("S/ 3.00"), para pintarlo
 */
public record MenuExtraResponse(
        Long id,
        String name,
        BigDecimal price,
        String priceLabel,
        int orderIndex,
        boolean active
) {

    public static MenuExtraResponse of(Long id, String name, BigDecimal price, int orderIndex, boolean active) {
        return new MenuExtraResponse(id, name, price, "S/ %.2f".formatted(price), orderIndex, active);
    }
}

