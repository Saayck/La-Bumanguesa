package com.bumanguesa.api.menu.web;

import com.bumanguesa.api.menu.dto.MenuExtraRequest;
import com.bumanguesa.api.menu.dto.MenuExtraResponse;
import com.bumanguesa.api.menu.service.MenuExtraService;
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
 * Administración de adicionales del menú (CRUD protegido por JWT).
 */
@RestController
@RequestMapping("/api/admin/menu-extras")
public class AdminMenuExtraController {

    private final MenuExtraService service;

    public AdminMenuExtraController(MenuExtraService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuExtraResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public MenuExtraResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<MenuExtraResponse> create(@Valid @RequestBody MenuExtraRequest request) {
        MenuExtraResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/menu-extras/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public MenuExtraResponse update(@PathVariable Long id, @Valid @RequestBody MenuExtraRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
