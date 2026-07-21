package com.bumanguesa.api.video.service;

import com.bumanguesa.api.video.domain.Video;
import com.bumanguesa.api.video.repository.VideoRepository;

import com.bumanguesa.api.common.exception.DuplicateResourceException;
import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.video.dto.VideoRequest;
import com.bumanguesa.api.video.dto.VideoResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class VideoService {

    private final VideoRepository repository;

    public VideoService(VideoRepository repository) {
        this.repository = repository;
    }

    public List<VideoResponse> listPublic() {
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(VideoMapper::toResponse)
                .toList();
    }

    public List<VideoResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(VideoMapper::toResponse)
                .toList();
    }

    public VideoResponse getBySlug(String slug) {
        return VideoMapper.toResponse(findBySlug(slug));
    }

    @Transactional
    public VideoResponse create(VideoRequest request) {
        if (repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe un video con el slug: " + request.slug());
        }
        return VideoMapper.toResponse(repository.save(VideoMapper.toEntity(request)));
    }

    @Transactional
    public VideoResponse update(String slug, VideoRequest request) {
        Video entity = findBySlug(slug);
        if (!slug.equals(request.slug()) && repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe un video con el slug: " + request.slug());
        }
        VideoMapper.apply(entity, request);
        return VideoMapper.toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(String slug) {
        repository.delete(findBySlug(slug));
    }

    private Video findBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> ResourceNotFoundException.of("Video", slug));
    }
}
