package com.bumanguesa.api.ai.web;

import com.bumanguesa.api.ai.dto.AiStatusResponse;
import com.bumanguesa.api.ai.dto.ChatRequest;
import com.bumanguesa.api.ai.dto.ChatResponse;
import com.bumanguesa.api.ai.dto.RecommendRequest;
import com.bumanguesa.api.ai.dto.RecommendResponse;
import com.bumanguesa.api.ai.service.AiAssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Funciones de IA para clientes de la landing (públicas y con rate limiting
 * propio en {@code RateLimitingFilter}).
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiAssistantService assistant;

    public AiController(AiAssistantService assistant) {
        this.assistant = assistant;
    }

    /** Permite al frontend ocultar el chat y el recomendador si no hay motor. */
    @GetMapping("/status")
    public ResponseEntity<AiStatusResponse> status() {
        return ResponseEntity.ok(new AiStatusResponse(assistant.isEnabled(), assistant.model()));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(new ChatResponse(assistant.chat(request)));
    }

    @PostMapping("/recommend")
    public ResponseEntity<RecommendResponse> recommend(@Valid @RequestBody RecommendRequest request) {
        return ResponseEntity.ok(assistant.recommend(request.craving()));
    }
}
