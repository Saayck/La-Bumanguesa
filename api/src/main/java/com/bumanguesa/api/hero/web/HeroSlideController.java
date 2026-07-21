package com.bumanguesa.api.hero.web;

import com.bumanguesa.api.hero.service.HeroSlideService;

import com.bumanguesa.api.hero.dto.HeroSlideRequest;
import com.bumanguesa.api.hero.dto.HeroSlideResponse;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HeroSlideController {

    private final HeroSlideService service;

    public HeroSlideController(HeroSlideService service) {
        this.service = service;
    }

    @GetMapping("/api/hero-slides")
    public List<HeroSlideResponse> listPublic() {
        return service.listPublic();
    }

    @GetMapping("/api/admin/hero-slides")
    public List<HeroSlideResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/api/admin/hero-slides/{id}")
    public HeroSlideResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping("/api/admin/hero-slides")
    public ResponseEntity<HeroSlideResponse> create(@Valid @RequestBody HeroSlideRequest request) {
        HeroSlideResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/hero-slides/" + created.id())).body(created);
    }

    @PutMapping("/api/admin/hero-slides/{id}")
    public HeroSlideResponse update(@PathVariable Long id, @Valid @RequestBody HeroSlideRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/api/admin/hero-slides/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
