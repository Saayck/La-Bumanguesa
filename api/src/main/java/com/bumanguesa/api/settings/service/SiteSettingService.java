package com.bumanguesa.api.settings.service;

import com.bumanguesa.api.settings.domain.SiteSetting;
import com.bumanguesa.api.settings.repository.SiteSettingRepository;

import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.settings.dto.SiteSettingRequest;
import com.bumanguesa.api.settings.dto.SiteSettingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Reads and updates the single site configuration row.
 */
@Service
@Transactional(readOnly = true)
public class SiteSettingService {

    private final SiteSettingRepository repository;

    public SiteSettingService(SiteSettingRepository repository) {
        this.repository = repository;
    }

    public SiteSettingResponse get() {
        return SiteSettingMapper.toResponse(loadSingleton());
    }

    @Transactional
    public SiteSettingResponse update(SiteSettingRequest request) {
        SiteSetting entity = loadSingleton();
        SiteSettingMapper.apply(entity, request);
        return SiteSettingMapper.toResponse(repository.save(entity));
    }

    /** The configuration is a singleton seeded by Flyway (lowest id wins). */
    private SiteSetting loadSingleton() {
        return repository.findAll(org.springframework.data.domain.Sort.by("id")).stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La configuración del sitio no está inicializada."));
    }
}
