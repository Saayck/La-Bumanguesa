package com.bumanguesa.api.hero.service;

import com.bumanguesa.api.hero.domain.HeroSlide;
import com.bumanguesa.api.hero.repository.HeroSlideRepository;

import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.hero.dto.HeroSlideRequest;
import com.bumanguesa.api.hero.dto.HeroSlideResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class HeroSlideService {

    private final HeroSlideRepository repository;

    public HeroSlideService(HeroSlideRepository repository) {
        this.repository = repository;
    }

    public List<HeroSlideResponse> listPublic() {
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(HeroSlideMapper::toResponse)
                .toList();
    }

    public List<HeroSlideResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(HeroSlideMapper::toResponse)
                .toList();
    }

    public HeroSlideResponse getById(Long id) {
        return HeroSlideMapper.toResponse(findById(id));
    }

    @Transactional
    public HeroSlideResponse create(HeroSlideRequest request) {
        return HeroSlideMapper.toResponse(repository.save(HeroSlideMapper.toEntity(request)));
    }

    @Transactional
    public HeroSlideResponse update(Long id, HeroSlideRequest request) {
        HeroSlide entity = findById(id);
        HeroSlideMapper.apply(entity, request);
        return HeroSlideMapper.toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findById(id));
    }

    private HeroSlide findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Hero slide", id));
    }
}
