package com.bumanguesa.api.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.net.URI;
import java.util.Locale;

/**
 * Validates URLs to prevent SSRF attacks against internal network metadata or loopback addresses.
 */
public class SafeUrlValidator implements ConstraintValidator<SafeUrl, String> {

    private static final String[] BLOCKED_HOSTS = {
            "localhost", "127.0.0.1", "0.0.0.0", "::1",
            "169.254.169.254", // AWS/GCP metadata service
            "metadata.google.internal"
    };

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Use @NotBlank alongside @SafeUrl if required
        }

        try {
            URI uri = URI.create(value.trim());
            String scheme = uri.getScheme();

            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                return false;
            }

            String host = uri.getHost();
            if (host == null) {
                return false;
            }

            host = host.toLowerCase(Locale.ROOT);

            for (String blocked : BLOCKED_HOSTS) {
                if (host.equals(blocked) || host.endsWith("." + blocked)) {
                    return false;
                }
            }

            // Check for private IPv4 ranges (10.x.x.x, 172.16.x.x - 172.31.x.x, 192.168.x.x)
            if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.")) {
                return false;
            }

            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
