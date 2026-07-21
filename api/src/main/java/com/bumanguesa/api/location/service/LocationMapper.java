package com.bumanguesa.api.location.service;

import com.bumanguesa.api.location.domain.Location;

import com.bumanguesa.api.location.dto.LocationRequest;
import com.bumanguesa.api.location.dto.LocationResponse;

final class LocationMapper {

    private LocationMapper() {
    }

    static LocationResponse toResponse(Location e) {
        return new LocationResponse(
                e.getSlug(),
                e.getName(),
                e.getAddress(),
                e.getAccent(),
                e.getMapEmbedUrl(),
                e.getOrderIndex(),
                e.isActive());
    }

    static Location toEntity(LocationRequest r) {
        Location e = new Location();
        apply(e, r);
        return e;
    }

    static void apply(Location e, LocationRequest r) {
        e.setSlug(r.slug());
        e.setName(r.name());
        e.setAddress(r.address());
        e.setAccent(r.accent());
        e.setMapEmbedUrl(r.mapEmbedUrl());
        e.setOrderIndex(r.orderIndex());
        e.setActive(r.active());
    }
}
