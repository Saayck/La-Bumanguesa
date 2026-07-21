package com.bumanguesa.api.settings.web;

import com.bumanguesa.api.settings.service.SiteSettingService;

import com.bumanguesa.api.settings.dto.SiteSettingRequest;
import com.bumanguesa.api.settings.dto.SiteSettingResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Site configuration endpoints.
 * <ul>
 *   <li>GET  /api/site-config  — public, consumed by the Angular app.</li>
 *   <li>PUT  /api/site-config  — admin, updates the configuration.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/site-config")
public class SiteSettingController {

    private final SiteSettingService service;

    public SiteSettingController(SiteSettingService service) {
        this.service = service;
    }

    @GetMapping
    public SiteSettingResponse get() {
        return service.get();
    }

    @PutMapping
    public SiteSettingResponse update(@Valid @RequestBody SiteSettingRequest request) {
        return service.update(request);
    }
}
