package com.bumanguesa.api.ai.web;

import com.bumanguesa.api.ai.dto.AiSuggestionResponse;
import com.bumanguesa.api.ai.service.AiSuggestionService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/suggestions")
public class AiSuggestionController {

    private final AiSuggestionService service;

    public AiSuggestionController(AiSuggestionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AiSuggestionResponse>> list(@RequestParam(required = false) String kind) {
        return ResponseEntity.ok(service.listPublic(kind));
    }
}
