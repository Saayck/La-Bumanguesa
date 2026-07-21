package com.bumanguesa.api.video.dto;

import com.bumanguesa.api.common.domain.VideoPlatform;

/**
 * Video card as exposed by the API. {@code id} carries the slug to match the
 * Angular {@code VideoCard} interface.
 */
public record VideoResponse(
        String id,
        VideoPlatform platform,
        String label,
        String thumbnailUrl,
        String accentColor,
        int offsetY,
        String url,
        int orderIndex,
        boolean active) {
}
