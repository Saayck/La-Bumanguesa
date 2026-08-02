package com.bumanguesa.api.menu.dto;

import com.bumanguesa.api.common.domain.BrandAccent;

/**
 * Menu item as exposed by the API. {@code id} carries the slug so the payload
 * matches the Angular {@code MenuItem} interface; {@code orderIndex}/{@code active}
 * are additive fields used by the admin UI and ignored by the public site.
 *
 * <p>{@code itemId} es la clave primaria numérica. Es la que esperan
 * {@code POST /api/ratings} y {@code POST /api/ai/recommend}: sin ella el
 * frontend intentaba convertir el slug a número y todas las calificaciones
 * terminaban asignadas al producto 1.
 */
public record MenuItemResponse(
        String id,
        Long itemId,
        String title,
        String description,
        String imageUrl,
        String badge,
        int badgeRotation,
        BrandAccent accent,
        String ctaLabel,
        int orderIndex,
        boolean active) {
}
