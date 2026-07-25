package com.bumanguesa.api.hero.dto;

import com.bumanguesa.api.common.validation.SafeUrl;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Create/update payload for a hero slide with OWASP validation. */
public record HeroSlideRequest(
        @NotBlank @Size(max = 500) @SafeUrl String imageUrl,

        @NotNull @Min(0) @Max(60) Integer delaySeconds,

        @NotNull @Min(0) Integer orderIndex,
        @NotNull Boolean active) {
}
