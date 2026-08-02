package com.bumanguesa.api.ai.dto;

/** Dato de la base de conocimiento tal como lo ve el panel. */
public record KnowledgeResponse(
        Long id,
        String topic,
        String answer,
        int orderIndex,
        boolean active) {
}
