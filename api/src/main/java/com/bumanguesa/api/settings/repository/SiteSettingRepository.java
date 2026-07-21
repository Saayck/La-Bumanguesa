package com.bumanguesa.api.settings.repository;

import com.bumanguesa.api.settings.domain.SiteSetting;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, Long> {
}
