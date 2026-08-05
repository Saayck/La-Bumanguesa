package com.bumanguesa.api.ai.dto;

public record AiSuggestionResponse(
        Long id,
        String kind,
        String promptText,
        int orderIndex,
        boolean active
) {
    public static AiSuggestionResponse of(Long id, String kind, String promptText, int orderIndex, boolean active) {
        return new AiSuggestionResponse(id, kind, promptText, orderIndex, active);
    }
}
