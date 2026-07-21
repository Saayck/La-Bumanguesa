-- =====================================================================
-- Admin users for the JWT-protected admin panel.
-- The initial admin account is seeded at startup by AdminUserSeeder
-- (BCrypt-hashed), so no password is stored here.
-- =====================================================================

CREATE TABLE admin_user (
    id          BIGINT       IDENTITY(1,1) NOT NULL,
    username    NVARCHAR(60)  NOT NULL,
    password    NVARCHAR(100) NOT NULL,
    role        NVARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    active      BIT           NOT NULL DEFAULT 1,
    created_at  DATETIME2     NOT NULL,
    updated_at  DATETIME2     NOT NULL,
    CONSTRAINT pk_admin_user PRIMARY KEY (id),
    CONSTRAINT uq_admin_user_username UNIQUE (username)
);
