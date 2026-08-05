package com.bumanguesa.api.ai.service;

import com.bumanguesa.api.ai.domain.AiSuggestion;
import com.bumanguesa.api.ai.dto.AiSuggestionRequest;
import com.bumanguesa.api.ai.dto.AiSuggestionResponse;
import com.bumanguesa.api.ai.repository.AiSuggestionRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AiSuggestionService {

    private final AiSuggestionRepository repository;

    public AiSuggestionService(AiSuggestionRepository repository) {
        this.repository = repository;
    }

    public List<AiSuggestionResponse> listPublic(String kind) {
        if (kind != null && !kind.isBlank()) {
            return repository.findByKindAndActiveTrueOrderByOrderIndexAsc(kind).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AiSuggestionResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AiSuggestionResponse create(AiSuggestionRequest request) {
        AiSuggestion suggestion = new AiSuggestion();
        suggestion.setKind(request.kind().trim().toLowerCase());
        suggestion.setPromptText(request.promptText().trim());
        suggestion.setOrderIndex(request.orderIndex());
        suggestion.setActive(request.active() == null || request.active());
        return toResponse(repository.save(suggestion));
    }

    @Transactional
    public AiSuggestionResponse update(Long id, AiSuggestionRequest request) {
        AiSuggestion suggestion = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sugerencia no encontrada: " + id));
        suggestion.setKind(request.kind().trim().toLowerCase());
        suggestion.setPromptText(request.promptText().trim());
        suggestion.setOrderIndex(request.orderIndex());
        if (request.active() != null) {
            suggestion.setActive(request.active());
        }
        return toResponse(suggestion);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private AiSuggestionResponse toResponse(AiSuggestion e) {
        return AiSuggestionResponse.of(e.getId(), e.getKind(), e.getPromptText(), e.getOrderIndex(), e.isActive());
    }
}
