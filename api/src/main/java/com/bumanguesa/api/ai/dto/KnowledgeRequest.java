package com.bumanguesa.api.ai.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Alta o edición de un dato que el asistente debe conocer.
 *
 * <p>El texto pasa por {@code @SanitizedText}: aunque solo un admin autenticado
 * puede escribir aquí, este contenido acaba en el contexto del modelo, así que
 * se trata con la misma desconfianza que cualquier otra entrada.
 */
public record KnowledgeRequest(
        @NotBlank(message = "indica de qué trata el dato")
        @Size(max = 120)
        @SanitizedText
        String topic,

        @NotBlank(message = "escribe la respuesta que debe dar el asistente")
        @Size(max = 1000)
        @SanitizedText
        String answer,

        @NotNull @Min(0) Integer orderIndex,
        @NotNull Boolean active) {
}
