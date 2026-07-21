package com.bumanguesa.api.hero.dto;

/**
 * Hero slide as exposed by the API. Matches the Angular {@code HeroSlide}
 * interface (imageUrl + delaySeconds) plus admin metadata.
 */
public record HeroSlideResponse(
        Long id,
        String imageUrl,
        int delaySeconds,
        int orderIndex,
        boolean active) {
}
