package com.bumanguesa.api.ai.dto;

/**
 * Permite al frontend saber si debe mostrar u ocultar las funciones de IA.
 *
 * @param enabled si el motor está configurado en este entorno
 * @param model   modelo open source en uso (informativo)
 */
public record AiStatusResponse(boolean enabled, String model) {
}
