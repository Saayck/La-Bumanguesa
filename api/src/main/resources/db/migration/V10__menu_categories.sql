-- V10: Categorías dinámicas del menú con soporte de iconos SVG
CREATE TABLE menu_category (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu_category (slug, label, icon, order_index, active) VALUES
('clasicas', 'Hamburguesas', 'burger', 1, true),
('americanas', 'Burgers Americanas', 'flag', 2, true),
('arma-tu-burger', 'Arma tu Burger', 'flame', 3, true);

ALTER TABLE menu_item ADD COLUMN category_id BIGINT REFERENCES menu_category(id);

UPDATE menu_item SET category_id = (SELECT id FROM menu_category WHERE slug = 'americanas')
WHERE title LIKE '%(Burger Americana)%' OR LOWER(title) LIKE '%american%' OR LOWER(title) LIKE '%oklahoma%' OR LOWER(title) LIKE '%fantasti%';

UPDATE menu_item SET category_id = (SELECT id FROM menu_category WHERE slug = 'clasicas')
WHERE category_id IS NULL;
