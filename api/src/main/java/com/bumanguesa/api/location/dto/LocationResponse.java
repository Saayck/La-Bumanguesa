package com.bumanguesa.api.location.dto;

import com.bumanguesa.api.common.domain.BrandAccent;

/**
 * Location as exposed by the API. {@code id} carries the slug to match the
 * Angular {@code Location} interface.
 */
public record LocationResponse(
        String id,
        String name,
        String address,
        BrandAccent accent,
        String mapEmbedUrl,
        int orderIndex,
        boolean active) {
}
