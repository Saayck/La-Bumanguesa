package com.bumanguesa.api.menu.dto;

import com.bumanguesa.api.common.domain.BrandAccent;

/**
 * Menu item as exposed by the API. {@code id} carries the slug so the payload
 * matches the Angular {@code MenuItem} interface; {@code orderIndex}/{@code active}
 * are additive fields used by the admin UI and ignored by the public site.
 */
public record MenuItemResponse(
        String id,
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
