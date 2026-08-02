-- =====================================================================
-- Migration V5: Fix burger_rating audit columns.
--
-- BurgerRating extiende Auditable, que mapea `updated_at NOT NULL`
-- (@UpdateTimestamp). La tabla creada en V4 solo tenía `created_at`, así que
-- todo INSERT de Hibernate fallaba => POST /api/ratings devolvía 500.
-- =====================================================================

ALTER TABLE burger_rating ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE burger_rating SET updated_at = created_at WHERE updated_at IS NULL;

ALTER TABLE burger_rating ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE burger_rating ALTER COLUMN updated_at SET NOT NULL;

-- Índice para el ranking bayesiano (agrupa por item_id) y el listado reciente.
CREATE INDEX IF NOT EXISTS ix_burger_rating_item ON burger_rating (item_id);
CREATE INDEX IF NOT EXISTS ix_burger_rating_created_at ON burger_rating (created_at DESC);

-- Índices secundarios pendientes del diagnóstico: filtrado público (active, order_index).
CREATE INDEX IF NOT EXISTS ix_menu_item_active_order ON menu_item (active, order_index);
CREATE INDEX IF NOT EXISTS ix_video_active_order ON video (active, order_index);
CREATE INDEX IF NOT EXISTS ix_location_active_order ON location (active, order_index);
CREATE INDEX IF NOT EXISTS ix_hero_slide_active_order ON hero_slide (active, order_index);
