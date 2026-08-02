package com.bumanguesa.api.ai.dto;

import java.util.List;

/**
 * Lectura de las opiniones de clientes hecha por la IA.
 *
 * @param analyzedComments cuántos comentarios se analizaron
 * @param summary          resumen en prosa
 * @param strengths        lo que más gusta
 * @param improvements     oportunidades de mejora
 */
public record InsightsResponse(
        int analyzedComments,
        String summary,
        List<String> strengths,
        List<String> improvements) {
}
