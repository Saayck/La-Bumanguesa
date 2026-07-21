package com.bumanguesa.api.menu.web;

import com.bumanguesa.api.menu.service.MenuItemService;

import com.bumanguesa.api.menu.dto.MenuItemRequest;
import com.bumanguesa.api.menu.dto.MenuItemResponse;
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

/**
 * Menu items.
 * <ul>
 *   <li>GET /api/menu-items            — public list (active only).</li>
 *   <li>GET /api/admin/menu-items      — full list.</li>
 *   <li>GET/POST/PUT/DELETE under /api/admin/menu-items — administration.</li>
 * </ul>
 */
@RestController
public class MenuItemController {

    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    @GetMapping("/api/menu-items")
    public List<MenuItemResponse> listPublic() {
        return service.listPublic();
    }

    @GetMapping("/api/admin/menu-items")
    public List<MenuItemResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/api/admin/menu-items/{slug}")
    public MenuItemResponse getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }

    @PostMapping("/api/admin/menu-items")
    public ResponseEntity<MenuItemResponse> create(@Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/menu-items/" + created.id())).body(created);
    }

    @PutMapping("/api/admin/menu-items/{slug}")
    public MenuItemResponse update(@PathVariable String slug, @Valid @RequestBody MenuItemRequest request) {
        return service.update(slug, request);
    }

    @DeleteMapping("/api/admin/menu-items/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        service.delete(slug);
        return ResponseEntity.noContent().build();
    }
}
