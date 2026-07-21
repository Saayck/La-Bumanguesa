package com.bumanguesa.api.menu.dto;

import com.bumanguesa.api.common.domain.BrandAccent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Create/update payload for a menu item. */
public record MenuItemRequest(
        @NotBlank
        @Size(max = 80)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "debe ser un slug en minúsculas (ej: burgers-clasica)")
        String slug,

        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 500) String description,
        @NotBlank @Size(max = 500) String imageUrl,
        @NotBlank @Size(max = 60) String badge,

        @NotNull @Min(-15) @Max(15) Integer badgeRotation,

        @NotNull BrandAccent accent,

        @NotBlank @Size(max = 60) String ctaLabel,

        @NotNull @Min(0) Integer orderIndex,
        @NotNull Boolean active) {
}
