package com.bumanguesa.api.location.web;

import com.bumanguesa.api.location.service.LocationService;

import com.bumanguesa.api.location.dto.LocationRequest;
import com.bumanguesa.api.location.dto.LocationResponse;
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
public class LocationController {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping("/api/locations")
    public List<LocationResponse> listPublic() {
        return service.listPublic();
    }

    @GetMapping("/api/admin/locations")
    public List<LocationResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/api/admin/locations/{slug}")
    public LocationResponse getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }

    @PostMapping("/api/admin/locations")
    public ResponseEntity<LocationResponse> create(@Valid @RequestBody LocationRequest request) {
        LocationResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/locations/" + created.id())).body(created);
    }

    @PutMapping("/api/admin/locations/{slug}")
    public LocationResponse update(@PathVariable String slug, @Valid @RequestBody LocationRequest request) {
        return service.update(slug, request);
    }

    @DeleteMapping("/api/admin/locations/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        service.delete(slug);
        return ResponseEntity.noContent().build();
    }
}
