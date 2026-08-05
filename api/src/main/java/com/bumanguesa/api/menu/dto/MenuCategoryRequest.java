package com.bumanguesa.api.menu.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record MenuCategoryRequest(
        @NotBlank @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*") String slug,
        @NotBlank @SanitizedText String label,
        @NotBlank @SanitizedText String icon,
        @NotNull Integer orderIndex,
        Boolean active
) {}
