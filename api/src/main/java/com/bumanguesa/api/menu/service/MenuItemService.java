package com.bumanguesa.api.menu.service;

import com.bumanguesa.api.menu.domain.MenuCategory;
import com.bumanguesa.api.menu.domain.MenuItem;
import com.bumanguesa.api.menu.repository.MenuCategoryRepository;
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
    private final MenuCategoryRepository categoryRepository;

    public MenuItemService(MenuItemRepository repository, MenuCategoryRepository categoryRepository) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
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
        MenuItem entity = MenuItemMapper.toEntity(request);
        assignCategory(entity, request.categorySlug());
        MenuItem saved = repository.save(entity);
        return MenuItemMapper.toResponse(saved);
    }

    @Transactional
    public MenuItemResponse update(String slug, MenuItemRequest request) {
        MenuItem entity = findBySlug(slug);
        if (!slug.equals(request.slug()) && repository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Ya existe un menu item con el slug: " + request.slug());
        }
        MenuItemMapper.apply(entity, request);
        assignCategory(entity, request.categorySlug());
        return MenuItemMapper.toResponse(repository.save(entity));
    }

    private void assignCategory(MenuItem entity, String categorySlug) {
        if (categorySlug != null && !categorySlug.isBlank()) {
            MenuCategory category = categoryRepository.findBySlug(categorySlug.trim())
                    .orElse(null);
            entity.setCategory(category);
        }
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
