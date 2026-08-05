package com.bumanguesa.api.settings.service;

import com.bumanguesa.api.settings.domain.SectionTitle;
import com.bumanguesa.api.settings.domain.SiteSetting;
import com.bumanguesa.api.settings.repository.SectionTitleRepository;
import com.bumanguesa.api.settings.repository.SiteSettingRepository;

import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.settings.dto.SiteSettingRequest;
import com.bumanguesa.api.settings.dto.SiteSettingResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Reads and updates the single site configuration row.
 */
@Service
@Transactional(readOnly = true)
public class SiteSettingService {

    private final SiteSettingRepository repository;
    private final SectionTitleRepository sectionTitleRepository;

    public SiteSettingService(SiteSettingRepository repository, SectionTitleRepository sectionTitleRepository) {
        this.repository = repository;
        this.sectionTitleRepository = sectionTitleRepository;
    }

    public SiteSettingResponse get() {
        return SiteSettingMapper.toResponse(loadSingleton(), loadSectionTitles());
    }

    @Transactional
    public SiteSettingResponse update(SiteSettingRequest request) {
        SiteSetting entity = loadSingleton();
        SiteSettingMapper.apply(entity, request);
        return SiteSettingMapper.toResponse(repository.save(entity), loadSectionTitles());
    }

    private Map<String, SiteSettingResponse.SectionTitleDto> loadSectionTitles() {
        List<SectionTitle> titles = sectionTitleRepository.findByActiveTrue();
        return titles.stream().collect(Collectors.toMap(
                SectionTitle::getSectionKey,
                t -> new SiteSettingResponse.SectionTitleDto(t.getSectionKey(), t.getLeading(), t.getHighlight(), t.getAccent())
        ));
    }

    /** The configuration is a singleton seeded by Flyway (lowest id wins). */
    private SiteSetting loadSingleton() {
        return repository.findAll(org.springframework.data.domain.Sort.by("id")).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La configuración del sitio no está inicializada."));
    }
}
