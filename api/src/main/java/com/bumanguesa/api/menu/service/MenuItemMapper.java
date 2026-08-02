package com.bumanguesa.api.menu.service;

import com.bumanguesa.api.menu.domain.MenuItem;

import com.bumanguesa.api.menu.dto.MenuItemRequest;
import com.bumanguesa.api.menu.dto.MenuItemResponse;

final class MenuItemMapper {

    private MenuItemMapper() {
    }

    static MenuItemResponse toResponse(MenuItem e) {
        return new MenuItemResponse(
                e.getSlug(),
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getImageUrl(),
                e.getBadge(),
                e.getBadgeRotation(),
                e.getAccent(),
                e.getCtaLabel(),
                e.getOrderIndex(),
                e.isActive());
    }

    static MenuItem toEntity(MenuItemRequest r) {
        MenuItem e = new MenuItem();
        apply(e, r);
        return e;
    }

    static void apply(MenuItem e, MenuItemRequest r) {
        e.setSlug(r.slug());
        e.setTitle(r.title());
        e.setDescription(r.description());
        e.setImageUrl(r.imageUrl());
        e.setBadge(r.badge());
        e.setBadgeRotation(r.badgeRotation());
        e.setAccent(r.accent());
        e.setCtaLabel(r.ctaLabel());
        e.setOrderIndex(r.orderIndex());
        e.setActive(r.active());
    }
}
