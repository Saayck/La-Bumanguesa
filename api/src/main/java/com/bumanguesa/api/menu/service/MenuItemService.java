package com.bumanguesa.api.menu.service;

import com.bumanguesa.api.menu.domain.MenuItem;
import com.bumanguesa.api.menu.repository.MenuItemRepository;

import com.bumanguesa.api.common.exception.DuplicateResourceException;
import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.menu.dto.MenuItemRequest;
import com.bumanguesa.api.menu.dto.MenuItemResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }

    /** Active items, ordered — this is what the public site renders. */
    public List<MenuItemResponse> listPublic() {
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(MenuItemMapper::toResponse)
                .toList();
    }

    /** All items (active and inactive) for administration. */
    public List<MenuItemResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(MenuItemMapper::toResponse)
                .toList();
    }

    public MenuItemResponse getBySlug(String slug) {
        return MenuItemMapper.toResponse(findBySlug(slug));
    }

    @Transactional
    public MenuItemResponse create(MenuItemRequest request) {
        if (repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe un menu item con el slug: " + request.slug());
        }
        MenuItem saved = repository.save(MenuItemMapper.toEntity(request));
        return MenuItemMapper.toResponse(saved);
    }

    @Transactional
    public MenuItemResponse update(String slug, MenuItemRequest request) {
        MenuItem entity = findBySlug(slug);
        if (!slug.equals(request.slug()) && repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe un menu item con el slug: " + request.slug());
        }
        MenuItemMapper.apply(entity, request);
        return MenuItemMapper.toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(String slug) {
        repository.delete(findBySlug(slug));
    }

    private MenuItem findBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> ResourceNotFoundException.of("Menu item", slug));
    }
}
