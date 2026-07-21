-- =====================================================================
-- La Bumanguesa - initial schema (Microsoft SQL Server / T-SQL)
-- Mirrors the content contracts defined by the Angular frontend.
-- NVARCHAR is used everywhere so unicode content (accents, ★) is safe.
-- =====================================================================

CREATE TABLE site_setting (
    id                        BIGINT         IDENTITY(1,1) NOT NULL,
    brand                     NVARCHAR(80)   NOT NULL,
    city                      NVARCHAR(80)   NOT NULL,
    country                   NVARCHAR(80)   NOT NULL,
    whatsapp_number           NVARCHAR(15)   NOT NULL,
    whatsapp_display          NVARCHAR(40)   NOT NULL,
    default_order_message     NVARCHAR(500)  NOT NULL,
    show_promo_bar            BIT            NOT NULL DEFAULT 1,
    facebook_url              NVARCHAR(500)  NOT NULL,
    instagram_url             NVARCHAR(500)  NOT NULL,
    tiktok_url                NVARCHAR(500)  NOT NULL,
    hours_weekdays            NVARCHAR(60)   NOT NULL,
    hours_weekend             NVARCHAR(60)   NOT NULL,
    copyright_year            INT            NOT NULL,
    marquee_text              NVARCHAR(500)  NOT NULL,
    marquee_duration_seconds  INT            NOT NULL,
    created_at                DATETIME2      NOT NULL,
    updated_at                DATETIME2      NOT NULL,
    CONSTRAINT pk_site_setting PRIMARY KEY (id)
);

CREATE TABLE menu_item (
    id              BIGINT        IDENTITY(1,1) NOT NULL,
    slug            NVARCHAR(80)  NOT NULL,
    title           NVARCHAR(120) NOT NULL,
    description     NVARCHAR(500) NOT NULL,
    image_url       NVARCHAR(500) NOT NULL,
    badge           NVARCHAR(60)  NOT NULL,
    badge_rotation  INT           NOT NULL,
    accent          NVARCHAR(10)  NOT NULL,
    cta_label       NVARCHAR(60)  NOT NULL,
    order_index     INT           NOT NULL DEFAULT 0,
    active          BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME2     NOT NULL,
    updated_at      DATETIME2     NOT NULL,
    CONSTRAINT pk_menu_item PRIMARY KEY (id),
    CONSTRAINT uq_menu_item_slug UNIQUE (slug)
);

CREATE TABLE video (
    id             BIGINT        IDENTITY(1,1) NOT NULL,
    slug           NVARCHAR(80)  NOT NULL,
    platform       NVARCHAR(20)  NOT NULL,
    label          NVARCHAR(40)  NOT NULL,
    thumbnail_url  NVARCHAR(500) NOT NULL,
    accent_color   NVARCHAR(30)  NOT NULL,
    offset_y       INT           NOT NULL DEFAULT 0,
    url            NVARCHAR(500) NOT NULL,
    order_index    INT           NOT NULL DEFAULT 0,
    active         BIT           NOT NULL DEFAULT 1,
    created_at     DATETIME2     NOT NULL,
    updated_at     DATETIME2     NOT NULL,
    CONSTRAINT pk_video PRIMARY KEY (id),
    CONSTRAINT uq_video_slug UNIQUE (slug)
);

CREATE TABLE location (
    id             BIGINT         IDENTITY(1,1) NOT NULL,
    slug           NVARCHAR(80)   NOT NULL,
    name           NVARCHAR(120)  NOT NULL,
    address        NVARCHAR(200)  NOT NULL,
    accent         NVARCHAR(10)   NOT NULL,
    map_embed_url  NVARCHAR(2000) NOT NULL,
    order_index    INT            NOT NULL DEFAULT 0,
    active         BIT            NOT NULL DEFAULT 1,
    created_at     DATETIME2      NOT NULL,
    updated_at     DATETIME2      NOT NULL,
    CONSTRAINT pk_location PRIMARY KEY (id),
    CONSTRAINT uq_location_slug UNIQUE (slug)
);

CREATE TABLE hero_slide (
    id              BIGINT        IDENTITY(1,1) NOT NULL,
    image_url       NVARCHAR(500) NOT NULL,
    delay_seconds   INT           NOT NULL DEFAULT 0,
    order_index     INT           NOT NULL DEFAULT 0,
    active          BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME2     NOT NULL,
    updated_at      DATETIME2     NOT NULL,
    CONSTRAINT pk_hero_slide PRIMARY KEY (id)
);
