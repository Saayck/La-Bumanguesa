package com.bumanguesa.api.ai.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AiSuggestionRequest(
        @NotBlank String kind,
        @NotBlank @SanitizedText String promptText,
        @NotNull Integer orderIndex,
        Boolean active
) {}
