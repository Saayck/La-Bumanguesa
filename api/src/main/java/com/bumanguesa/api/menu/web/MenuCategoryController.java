package com.bumanguesa.api.menu.web;

import com.bumanguesa.api.menu.dto.MenuCategoryResponse;
import com.bumanguesa.api.menu.service.MenuCategoryService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menu-categories")
public class MenuCategoryController {

    private final MenuCategoryService service;

    public MenuCategoryController(MenuCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<MenuCategoryResponse>> list() {
        return ResponseEntity.ok(service.listPublic());
    }
}
