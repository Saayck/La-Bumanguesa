package com.bumanguesa.api.ai.dto;

import java.util.List;

/**
 * Recomendaciones de la IA. Los {@code itemId} siempre corresponden a productos
 * reales y activos de la carta: el backend descarta cualquier id inventado por
 * el modelo antes de responder.
 */
public record RecommendResponse(
        String intro,
        List<Suggestion> suggestions,
        List<Extra> extras,
        Venue venue) {

    public record Suggestion(Long itemId, String title, String badge, String imageUrl, String reason) {
    }

    /** Adicional sugerido para completar el pedido. */
    public record Extra(Long id, String name, String priceLabel, String reason) {
    }

    /** Sede sugerida para ir a comer, con su mapa. */
    public record Venue(String name, String address, String mapEmbedUrl) {
    }
}
