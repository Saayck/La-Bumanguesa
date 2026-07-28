-- =====================================================================
-- Seed data — ANSI SQL compatible con PostgreSQL (Supabase) y H2
-- Basado en la carta oficial de La Bumanguesa - Ica
-- =====================================================================

INSERT INTO site_setting
    (brand, city, country, whatsapp_number, whatsapp_display, default_order_message,
     show_promo_bar, facebook_url, instagram_url, tiktok_url,
     hours_weekdays, hours_weekend, copyright_year,
     marquee_text, marquee_duration_seconds, created_at, updated_at)
VALUES
    ('LA BUMANGUESA', 'Ica', 'Perú', '51989451473', '989 451 473',
     'Hola La Bumanguesa! Vengo de la página web y deseo hacer un pedido.',
     TRUE,
     'https://www.facebook.com/La-Bumanguesa-Ica',
     'https://www.instagram.com/Bumanguesafoodtruck',
     'https://www.tiktok.com/@Bumanguesafoodtruck',
     '5:00 PM – 12:00 AM', '5:00 PM – 1:00 AM', 2026,
     '🔥 ¡TODAS LAS HAMBURGUESAS INCLUYEN PAPAS Y CEBOLLA CARAMELIZADA! ★ 1 SOL ADICIONAL PARA LLEVAR ★ DELIVERY EN TODO ICA ★ PIDELAS AL 989 451 473 ★',
     22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO menu_item
    (slug, title, description, image_url, badge, badge_rotation, accent, cta_label, order_index, active, created_at, updated_at)
VALUES
    ('bumanguesa', 'Bumanguesa',
     'Doble carne de res, tocineta, salchicha ahumada, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
     'S/ 32.00', 3, 'YELLOW', 'Pedir por WhatsApp', 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('clasica', 'Clásica',
     'Carne de res, cebolla caramelizada, papas al hilo, salsa de la casa, lechuga y tomate en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
     'S/ 16.00', -2, 'GREEN', 'Pedir por WhatsApp', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('sencilla', 'Sencilla',
     'Carne de res, jamón, mix de quesos, cebolla caramelizada, lechuga, tomate, papitas al hilo y salsa de la casa en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
     'S/ 20.00', 2, 'PINK', 'Pedir por WhatsApp', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('royal', 'Royal',
     'Carne de res, huevo, mix de quesos, lechuga, tomate, tocineta y salsa de la casa en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
     'S/ 24.00', -3, 'YELLOW', 'Pedir por WhatsApp', 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('americana', 'Americana',
     'Doble filete de pollo, tocineta, mix de quesos, lechuga, tomate, papitas al hilo y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
     'S/ 25.00', 3, 'GREEN', 'Pedir por WhatsApp', 4, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('mixta', 'Mixta',
     'Carne de res, pollo deshilachado, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?auto=format&fit=crop&w=800&q=80',
     'S/ 26.00', -2, 'PINK', 'Pedir por WhatsApp', 5, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('hawaiiana', 'Hawaiiana',
     'Carne de res, rodaja de piña, jamón, mix de quesos, tocineta, lechuga, tomate, papitas al hilo y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
     'S/ 27.00', 2, 'YELLOW', 'Pedir por WhatsApp', 6, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('bacon', 'Bacon',
     'Carne de res, tocineta, chorizo, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
     'S/ 27.00', -3, 'PINK', 'Pedir por WhatsApp', 7, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('poderosa', 'Poderosa',
     'Carne de res, filete de pollo, jamón, tocineta, mix de quesos, lechuga, tomate, papitas al hilo y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80',
     'S/ 27.00', 3, 'YELLOW', 'Pedir por WhatsApp', 8, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('reina', 'Reina',
     'Carne de res, tocineta, salchicha ahumada, mix de quesos, lechuga, tomate y cebolla blanca en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=800&q=80',
     'S/ 28.00', -2, 'GREEN', 'Pedir por WhatsApp', 9, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('queen-cheese', 'Queen Cheese',
     'Carne de res, tocineta, queso philadelphia, cebolla caramelizada, baño de queso, coronada de maíz dulce y papas al hilo en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
     'S/ 30.00', 2, 'YELLOW', 'Pedir por WhatsApp', 10, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('chicken-crispy', 'Chicken Crispy',
     'Carne de res, filete de pollo apanado, mix de quesos, lechuga, tomate y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
     'S/ 30.00', -3, 'GREEN', 'Pedir por WhatsApp', 11, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('choricarne', 'Choricarne',
     'Carne de res, chorizo, madurito, mix de quesos, lechuga, tomate, carne deshilachada y cebolla caramelizada en pan brioche. ¡Todas salen con papas!',
     'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?auto=format&fit=crop&w=800&q=80',
     'S/ 32.00', 3, 'PINK', 'Pedir por WhatsApp', 12, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('american', 'American (Burger Americana)',
     'Doble carne de res (160g), mix de queso, mix de tocineta, cebolla en aro blanca, pepino, lechuga, tomate, salsa de la casa y queso crema en pan brioche.',
     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
     'S/ 32.00', -2, 'YELLOW', 'Pedir por WhatsApp', 13, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('american-bacon', 'American Bacon (Burger Americana)',
     'Doble carne de res (160g), doble cheddar, doble mozzarella, doble tocineta, cebolla crispy en aro y queso crema en pan brioche.',
     'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
     'S/ 32.00', 2, 'PINK', 'Pedir por WhatsApp', 14, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('oklahoma', 'Oklahoma (Burger Americana)',
     'Doble carne de res (160g), doble cheddar, mozzarella, cebolla en salsa de tocineta, smoked bacon, salsa de la casa y queso crema en pan brioche.',
     'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
     'S/ 32.00', -3, 'YELLOW', 'Pedir por WhatsApp', 15, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('fantasti-burger', 'Fantasti Burger (Burger Americana)',
     'Carne de res, mix de quesos, carne desmechada, pollo desmechado en tártara, queso crema, tocineta, tomate y lechuga en pan brioche.',
     'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
     'S/ 32.00', 3, 'GREEN', 'Pedir por WhatsApp', 16, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO video
    (slug, platform, label, thumbnail_url, accent_color, offset_y, url, order_index, active, created_at, updated_at)
VALUES
    ('tiktok-burger', 'TIKTOK', 'TikTok',
     'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80',
     '#fff', 0, 'https://www.tiktok.com/@Bumanguesafoodtruck', 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('reels-salchipapa', 'INSTAGRAM', 'Reels',
     'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80',
     '#FF0066', 32, 'https://www.instagram.com/Bumanguesafoodtruck', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('shorts-prep', 'YOUTUBE', 'Shorts',
     'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=600&q=80',
     '#FF0000', 64, 'https://www.facebook.com/La-Bumanguesa-Ica', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO location
    (slug, name, address, accent, map_embed_url, order_index, active, created_at, updated_at)
VALUES
    ('puente-blanco', 'Sede Puente Blanco', 'Urb. Puente Blanco B 11, Ica', 'YELLOW',
     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.366453535973!2d-75.7360!3d-14.0550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDAzJzE4LjAiUyA3NcKwNDQnMDkuNiJX!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe',
     0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ayabaca', 'Sede Ayabaca', 'Av. Ayabaca 846 (Frente al museo), Ica', 'GREEN',
     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.123456789!2d-75.7282054!3d-14.0683413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e2eb0c66099b%3A0xc3c5d6e246960d70!2sAv.%20Ayabaca%20846%2C%20Ica%2011004%2C%20Per%C3%BA!5e0!3m2!1ses!2spe!4v1700000000001!5m2!1ses!2spe',
     1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO hero_slide
    (image_url, delay_seconds, order_index, active, created_at, updated_at)
VALUES
    ('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80', 0, 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1600&q=80', 4, 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80', 8, 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
