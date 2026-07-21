-- =====================================================================
-- Seed data — 1:1 with the values currently hardcoded in the Angular app
-- (site.config.ts, menu/videos/hero/locations services, marquee).
-- N'...' literals + SYSUTCDATETIME() for SQL Server.
-- =====================================================================

INSERT INTO site_setting
    (brand, city, country, whatsapp_number, whatsapp_display, default_order_message,
     show_promo_bar, facebook_url, instagram_url, tiktok_url,
     hours_weekdays, hours_weekend, copyright_year,
     marquee_text, marquee_duration_seconds, created_at, updated_at)
VALUES
    (N'LA BUMANGUESA', N'Ica', N'Perú', N'51989451473', N'989 451 473',
     N'Hola La Bumanguesa! Vengo de la página web y deseo hacer un pedido.',
     1,
     N'https://www.facebook.com/p/La-Bumanguesa-Ica-100092579427800/',
     N'#', N'#',
     N'5:00 PM – 12:00 AM', N'5:00 PM – 1:00 AM', 2026,
     N'Burgers ★ Salchipapas ★ Alitas ★ Combos ★ Delivery en todo Ica ★ Burgers ★ Salchipapas ★ Alitas ★ Combos ★ Delivery en todo Ica ★',
     22, SYSUTCDATETIME(), SYSUTCDATETIME());

INSERT INTO menu_item
    (slug, title, description, image_url, badge, badge_rotation, accent, cta_label, order_index, active, created_at, updated_at)
VALUES
    (N'burgers', N'Burgers reales',
     N'Carne jugosa, pan artesanal, full queso y nuestros aderezos secretos que te volarán la cabeza.',
     N'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
     N'¡Clásica!', 3, N'YELLOW', N'Pedir ahora', 0, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'salchipapas', N'Salchipapas',
     N'Papas crocantes, todas las cremas, carnes picadas y una porción que no te dejará con hambre.',
     N'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
     N'¡Abundante!', -3, N'PINK', N'Pedir ahora', 1, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'combos', N'Combos locos',
     N'Junta a la mancha. Opciones que mezclan lo mejor de nuestra carta a un precio brutal.',
     N'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
     N'¡Para compartir!', 2, N'GREEN', N'Ver promociones', 2, 1, SYSUTCDATETIME(), SYSUTCDATETIME());

INSERT INTO video
    (slug, platform, label, thumbnail_url, accent_color, offset_y, url, order_index, active, created_at, updated_at)
VALUES
    (N'tiktok-burger', N'TIKTOK', N'TikTok',
     N'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80',
     N'#fff', 0, N'#', 0, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'reels-salchipapa', N'INSTAGRAM', N'Reels',
     N'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80',
     N'#FF0066', 32, N'#', 1, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'shorts-prep', N'YOUTUBE', N'Shorts',
     N'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=600&q=80',
     N'#FF0000', 64, N'#', 2, 1, SYSUTCDATETIME(), SYSUTCDATETIME());

INSERT INTO location
    (slug, name, address, accent, map_embed_url, order_index, active, created_at, updated_at)
VALUES
    (N'puente-blanco', N'Sede Puente Blanco', N'Urb. Puente Blanco B 11, Ica', N'YELLOW',
     N'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.366453535973!2d-75.7360!3d-14.0550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDAzJzE4LjAiUyA3NcKwNDQnMDkuNiJX!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe',
     0, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'ayabaca', N'Sede Ayabaca', N'Av. Ayabaca 846 (Frente al museo)', N'GREEN',
     N'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.123456789!2d-75.7282054!3d-14.0683413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e2eb0c66099b%3A0xc3c5d6e246960d70!2sAv.%20Ayabaca%20846%2C%20Ica%2011004%2C%20Per%C3%BA!5e0!3m2!1ses!2spe!4v1700000000001!5m2!1ses!2spe',
     1, 1, SYSUTCDATETIME(), SYSUTCDATETIME());

INSERT INTO hero_slide
    (image_url, delay_seconds, order_index, active, created_at, updated_at)
VALUES
    (N'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80', 0, 0, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1600&q=80', 4, 1, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (N'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80', 8, 2, 1, SYSUTCDATETIME(), SYSUTCDATETIME());
