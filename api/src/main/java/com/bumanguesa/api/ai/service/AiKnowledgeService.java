package com.bumanguesa.api.ai.service;

import com.bumanguesa.api.ai.domain.AiKnowledge;
import com.bumanguesa.api.ai.dto.KnowledgeRequest;
import com.bumanguesa.api.ai.dto.KnowledgeResponse;
import com.bumanguesa.api.ai.repository.AiKnowledgeRepository;
import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CRUD de los datos que el negocio le enseña al asistente. */
@Service
@Transactional(readOnly = true)
public class AiKnowledgeService {

    private final AiKnowledgeRepository repository;

    public AiKnowledgeService(AiKnowledgeRepository repository) {
        this.repository = repository;
    }

    public List<KnowledgeResponse> list() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(AiKnowledgeService::toResponse)
                .toList();
    }

    @Transactional
    public KnowledgeResponse create(KnowledgeRequest request) {
        AiKnowledge entity = new AiKnowledge();
        apply(entity, request);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public KnowledgeResponse update(Long id, KnowledgeRequest request) {
        AiKnowledge entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ese dato ya no existe."));
        apply(entity, request);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Ese dato ya no existe.");
        }
        repository.deleteById(id);
    }

    private static void apply(AiKnowledge entity, KnowledgeRequest request) {
        entity.setTopic(request.topic().trim());
        entity.setAnswer(request.answer().trim());
        entity.setOrderIndex(request.orderIndex());
        entity.setActive(request.active());
    }

    private static KnowledgeResponse toResponse(AiKnowledge e) {
        return new KnowledgeResponse(e.getId(), e.getTopic(), e.getAnswer(), e.getOrderIndex(), e.isActive());
    }
}
