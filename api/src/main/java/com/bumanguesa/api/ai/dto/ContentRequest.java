package com.bumanguesa.api.ai.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Petición del panel de administración para redactar contenido comercial.
 *
 * @param kind  qué se quiere redactar
 * @param brief datos de entrada (nombre del producto, ingredientes, promoción…)
 */
public record ContentRequest(
        @NotNull(message = "indica qué tipo de texto quieres generar")
        Kind kind,

        @Size(max = 500, message = "el brief es demasiado largo")
        @SanitizedText
        String brief) {

    public enum Kind {
        /** Descripción comercial de un producto de la carta. */
        MENU_DESCRIPTION,
        /** Texto corto y llamativo para la marquesina animada. */
        MARQUEE,
        /** Copy para la barra de promociones. */
        PROMO
    }
}
