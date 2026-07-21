package com.bumanguesa.api.location.service;

import com.bumanguesa.api.location.domain.Location;
import com.bumanguesa.api.location.repository.LocationRepository;

import com.bumanguesa.api.common.exception.DuplicateResourceException;
import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.location.dto.LocationRequest;
import com.bumanguesa.api.location.dto.LocationResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class LocationService {

    private final LocationRepository repository;

    public LocationService(LocationRepository repository) {
        this.repository = repository;
    }

    public List<LocationResponse> listPublic() {
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(LocationMapper::toResponse)
                .toList();
    }

    public List<LocationResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(LocationMapper::toResponse)
                .toList();
    }

    public LocationResponse getBySlug(String slug) {
        return LocationMapper.toResponse(findBySlug(slug));
    }

    @Transactional
    public LocationResponse create(LocationRequest request) {
        if (repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe una sede con el slug: " + request.slug());
        }
        return LocationMapper.toResponse(repository.save(LocationMapper.toEntity(request)));
    }

    @Transactional
    public LocationResponse update(String slug, LocationRequest request) {
        Location entity = findBySlug(slug);
        if (!slug.equals(request.slug()) && repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe una sede con el slug: " + request.slug());
        }
        LocationMapper.apply(entity, request);
        return LocationMapper.toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(String slug) {
        repository.delete(findBySlug(slug));
    }

    private Location findBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> ResourceNotFoundException.of("Sede", slug));
    }
}
