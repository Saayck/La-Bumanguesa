package com.bumanguesa.api.ai.web;

import com.bumanguesa.api.ai.dto.AiSuggestionRequest;
import com.bumanguesa.api.ai.dto.AiSuggestionResponse;
import com.bumanguesa.api.ai.service.AiSuggestionService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/ai/suggestions")
public class AdminAiSuggestionController {

    private final AiSuggestionService service;

    public AdminAiSuggestionController(AiSuggestionService service) {
        this.service = service;
    }

    @GetMapping
    public List<AiSuggestionResponse> listAll() {
        return service.listAll();
    }

    @PostMapping
    public ResponseEntity<AiSuggestionResponse> create(@Valid @RequestBody AiSuggestionRequest request) {
        AiSuggestionResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/ai/suggestions/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public AiSuggestionResponse update(@PathVariable Long id, @Valid @RequestBody AiSuggestionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
