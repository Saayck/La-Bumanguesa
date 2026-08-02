package com.bumanguesa.api.ai.repository;

import com.bumanguesa.api.ai.domain.AiKnowledge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiKnowledgeRepository extends JpaRepository<AiKnowledge, Long> {

    List<AiKnowledge> findByActiveTrueOrderByOrderIndexAsc();

    List<AiKnowledge> findAllByOrderByOrderIndexAsc();
}
