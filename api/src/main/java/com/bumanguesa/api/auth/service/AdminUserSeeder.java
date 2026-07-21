package com.bumanguesa.api.auth.service;

import com.bumanguesa.api.auth.domain.AdminUser;
import com.bumanguesa.api.auth.repository.AdminUserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the initial admin account on first startup if it does not exist.
 * Credentials come from {@code app.admin.username} / {@code app.admin.password}.
 */
@Component
public class AdminUserSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeeder.class);

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminUserSeeder(AdminUserRepository repository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.username:admin}") String username,
                           @Value("${app.admin.password:Bumanguesa2026!}") String password) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.existsByUsername(username)) {
            return;
        }
        AdminUser admin = new AdminUser();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ADMIN");
        admin.setActive(true);
        repository.save(admin);
        log.info("Cuenta admin inicial creada: '{}'. Cambia la contraseña por defecto en producción.", username);
    }
}
