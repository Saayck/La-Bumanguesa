package com.bumanguesa.api.menu.service;

import com.bumanguesa.api.menu.domain.MenuCategory;
import com.bumanguesa.api.menu.dto.MenuCategoryRequest;
import com.bumanguesa.api.menu.dto.MenuCategoryResponse;
import com.bumanguesa.api.menu.repository.MenuCategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MenuCategoryService {

    private final MenuCategoryRepository repository;

    public MenuCategoryService(MenuCategoryRepository repository) {
        this.repository = repository;
    }

    public List<MenuCategoryResponse> listPublic() {
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MenuCategoryResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public MenuCategoryResponse getBySlug(String slug) {
        return repository.findBySlug(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + slug));
    }

    @Transactional
    public MenuCategoryResponse create(MenuCategoryRequest request) {
        if (repository.findBySlug(request.slug()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una categoría con el slug: " + request.slug());
        }
        MenuCategory category = new MenuCategory();
        category.setSlug(request.slug().trim().toLowerCase());
        category.setLabel(request.label().trim());
        category.setIcon(request.icon().trim());
        category.setOrderIndex(request.orderIndex());
        category.setActive(request.active() == null || request.active());
        return toResponse(repository.save(category));
    }

    @Transactional
    public MenuCategoryResponse update(String slug, MenuCategoryRequest request) {
        MenuCategory category = repository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + slug));
        category.setLabel(request.label().trim());
        category.setIcon(request.icon().trim());
        category.setOrderIndex(request.orderIndex());
        if (request.active() != null) {
            category.setActive(request.active());
        }
        return toResponse(category);
    }

    @Transactional
    public void delete(String slug) {
        MenuCategory category = repository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + slug));
        repository.delete(category);
    }

    private MenuCategoryResponse toResponse(MenuCategory entity) {
        return MenuCategoryResponse.of(
                entity.getId(),
                entity.getSlug(),
                entity.getLabel(),
                entity.getIcon(),
                entity.getOrderIndex(),
                entity.isActive()
        );
    }
}
