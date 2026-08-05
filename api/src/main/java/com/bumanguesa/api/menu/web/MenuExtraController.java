package com.bumanguesa.api.menu.web;

import com.bumanguesa.api.menu.dto.MenuExtraResponse;
import com.bumanguesa.api.menu.service.MenuExtraService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Adicionales visibles en la web (lectura pública). */
@RestController
@RequestMapping("/api/menu-extras")
public class MenuExtraController {

    private final MenuExtraService service;

    public MenuExtraController(MenuExtraService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<MenuExtraResponse>> list() {
        return ResponseEntity.ok(service.listActive());
    }
}
