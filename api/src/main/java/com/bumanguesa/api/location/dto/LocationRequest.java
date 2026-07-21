package com.bumanguesa.api.location.dto;

import com.bumanguesa.api.common.domain.BrandAccent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Create/update payload for a store location. */
public record LocationRequest(
        @NotBlank
        @Size(max = 80)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "debe ser un slug en minúsculas (ej: puente-blanco)")
        String slug,

        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 200) String address,

        @NotNull BrandAccent accent,

        @NotBlank @Size(max = 2000) String mapEmbedUrl,

        @NotNull @Min(0) Integer orderIndex,
        @NotNull Boolean active) {
}
