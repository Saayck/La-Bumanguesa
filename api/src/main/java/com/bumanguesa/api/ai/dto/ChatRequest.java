package com.bumanguesa.api.ai.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Conversación que el navegador envía al asistente. Se manda completa en cada
 * petición porque el backend no guarda estado de chat (mismo modelo sin sesión
 * que el resto de la API, que es stateless).
 */
public record ChatRequest(
        @NotEmpty(message = "la conversación no puede estar vacía")
        @Size(max = 20, message = "la conversación es demasiado larga")
        @Valid List<Turn> messages) {

    public record Turn(
            @NotBlank
            @Pattern(regexp = "user|assistant", message = "el rol debe ser 'user' o 'assistant'")
            String role,

            @NotBlank
            @Size(max = 1000, message = "el mensaje es demasiado largo")
            @SanitizedText
            String content) {
    }
}
