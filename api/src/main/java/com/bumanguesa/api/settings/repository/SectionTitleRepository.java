package com.bumanguesa.api.settings.repository;

import com.bumanguesa.api.settings.domain.SectionTitle;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionTitleRepository extends JpaRepository<SectionTitle, Long> {

    List<SectionTitle> findByActiveTrue();

    Optional<SectionTitle> findBySectionKey(String sectionKey);
}
