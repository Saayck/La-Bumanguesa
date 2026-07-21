package com.bumanguesa.api.video.dto;

import com.bumanguesa.api.common.domain.VideoPlatform;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Create/update payload for a video card. */
public record VideoRequest(
        @NotBlank
        @Size(max = 80)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "debe ser un slug en minúsculas (ej: tiktok-burger)")
        String slug,

        @NotNull VideoPlatform platform,

        @NotBlank @Size(max = 40) String label,
        @NotBlank @Size(max = 500) String thumbnailUrl,
        @NotBlank @Size(max = 30) String accentColor,

        @NotNull @Min(0) @Max(500) Integer offsetY,

        @NotBlank @Size(max = 500) String url,

        @NotNull @Min(0) Integer orderIndex,
        @NotNull Boolean active) {
}
