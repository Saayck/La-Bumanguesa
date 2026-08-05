package com.bumanguesa.api.menu.web;

import com.bumanguesa.api.menu.dto.MenuCategoryRequest;
import com.bumanguesa.api.menu.dto.MenuCategoryResponse;
import com.bumanguesa.api.menu.service.MenuCategoryService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/menu-categories")
public class AdminMenuCategoryController {

    private final MenuCategoryService service;

    public AdminMenuCategoryController(MenuCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuCategoryResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/{slug}")
    public MenuCategoryResponse getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }

    @PostMapping
    public ResponseEntity<MenuCategoryResponse> create(@Valid @RequestBody MenuCategoryRequest request) {
        MenuCategoryResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/menu-categories/" + created.slug())).body(created);
    }

    @PutMapping("/{slug}")
    public MenuCategoryResponse update(@PathVariable String slug, @Valid @RequestBody MenuCategoryRequest request) {
        return service.update(slug, request);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        service.delete(slug);
        return ResponseEntity.noContent().build();
    }
}
