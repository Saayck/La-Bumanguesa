package com.bumanguesa.api.hero.service;

import com.bumanguesa.api.hero.domain.HeroSlide;

import com.bumanguesa.api.hero.dto.HeroSlideRequest;
import com.bumanguesa.api.hero.dto.HeroSlideResponse;

final class HeroSlideMapper {

    private HeroSlideMapper() {
    }

    static HeroSlideResponse toResponse(HeroSlide e) {
        return new HeroSlideResponse(
                e.getId(),
                e.getImageUrl(),
                e.getDelaySeconds(),
                e.getOrderIndex(),
                e.isActive());
    }

    static HeroSlide toEntity(HeroSlideRequest r) {
        HeroSlide e = new HeroSlide();
        apply(e, r);
        return e;
    }

    static void apply(HeroSlide e, HeroSlideRequest r) {
        e.setImageUrl(r.imageUrl());
        e.setDelaySeconds(r.delaySeconds());
        e.setOrderIndex(r.orderIndex());
        e.setActive(r.active());
    }
}
