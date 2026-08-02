package com.bumanguesa.api.ai.web;

import com.bumanguesa.api.ai.dto.ContentRequest;
import com.bumanguesa.api.ai.dto.ContentResponse;
import com.bumanguesa.api.ai.dto.InsightsResponse;
import com.bumanguesa.api.ai.dto.KnowledgeRequest;
import com.bumanguesa.api.ai.dto.KnowledgeResponse;
import com.bumanguesa.api.ai.service.AiAssistantService;
import com.bumanguesa.api.ai.service.AiKnowledgeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Asistentes de IA del panel de administración. Cuelga de {@code /api/admin},
 * así que hereda la exigencia de JWT de {@code SecurityConfig}.
 */
@RestController
@RequestMapping("/api/admin/ai")
public class AiAdminController {

    private final AiAssistantService assistant;
    private final AiKnowledgeService knowledge;

    public AiAdminController(AiAssistantService assistant, AiKnowledgeService knowledge) {
        this.assistant = assistant;
        this.knowledge = knowledge;
    }

    // ---- Base de conocimiento: así se "entrena" al asistente ----------

    @GetMapping("/knowledge")
    public ResponseEntity<List<KnowledgeResponse>> listKnowledge() {
        return ResponseEntity.ok(knowledge.list());
    }

    @PostMapping("/knowledge")
    public ResponseEntity<KnowledgeResponse> createKnowledge(@Valid @RequestBody KnowledgeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(knowledge.create(request));
    }

    @PutMapping("/knowledge/{id}")
    public ResponseEntity<KnowledgeResponse> updateKnowledge(@PathVariable Long id,
                                                             @Valid @RequestBody KnowledgeRequest request) {
        return ResponseEntity.ok(knowledge.update(id, request));
    }

    @DeleteMapping("/knowledge/{id}")
    public ResponseEntity<Void> deleteKnowledge(@PathVariable Long id) {
        knowledge.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Redacta descripciones de productos, marquesina o avisos de promoción. */
    @PostMapping("/content")
    public ResponseEntity<ContentResponse> content(@Valid @RequestBody ContentRequest request) {
        return ResponseEntity.ok(new ContentResponse(assistant.generateContent(request)));
    }

    /** Resume las últimas opiniones de clientes en fortalezas y mejoras. */
    @GetMapping("/insights")
    public ResponseEntity<InsightsResponse> insights() {
        return ResponseEntity.ok(assistant.summarizeReviews());
    }
}
