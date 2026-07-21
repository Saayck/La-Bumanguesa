package com.bumanguesa.api.video.service;

import com.bumanguesa.api.video.domain.Video;

import com.bumanguesa.api.video.dto.VideoRequest;
import com.bumanguesa.api.video.dto.VideoResponse;

final class VideoMapper {

    private VideoMapper() {
    }

    static VideoResponse toResponse(Video e) {
        return new VideoResponse(
                e.getSlug(),
                e.getPlatform(),
                e.getLabel(),
                e.getThumbnailUrl(),
                e.getAccentColor(),
                e.getOffsetY(),
                e.getUrl(),
                e.getOrderIndex(),
                e.isActive());
    }

    static Video toEntity(VideoRequest r) {
        Video e = new Video();
        apply(e, r);
        return e;
    }

    static void apply(Video e, VideoRequest r) {
        e.setSlug(r.slug());
        e.setPlatform(r.platform());
        e.setLabel(r.label());
        e.setThumbnailUrl(r.thumbnailUrl());
        e.setAccentColor(r.accentColor());
        e.setOffsetY(r.offsetY());
        e.setUrl(r.url());
        e.setOrderIndex(r.orderIndex());
        e.setActive(r.active());
    }
}
