package com.bumanguesa.api.ai.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Antojo del cliente en lenguaje natural
 * ("algo con harto queso y picante, que no pase de 25 soles").
 */
public record RecommendRequest(
        @NotBlank(message = "cuéntanos qué se te antoja")
        @Size(max = 300, message = "descripción demasiado larga")
        @SanitizedText
        String craving) {
}
