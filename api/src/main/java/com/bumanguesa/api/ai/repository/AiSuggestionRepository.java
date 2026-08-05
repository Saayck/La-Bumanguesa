package com.bumanguesa.api.ai.repository;

import com.bumanguesa.api.ai.domain.AiSuggestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiSuggestionRepository extends JpaRepository<AiSuggestion, Long> {

    List<AiSuggestion> findByActiveTrueOrderByOrderIndexAsc();

    List<AiSuggestion> findByKindAndActiveTrueOrderByOrderIndexAsc(String kind);

    List<AiSuggestion> findAllByOrderByOrderIndexAsc();
}
