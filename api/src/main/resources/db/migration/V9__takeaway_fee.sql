-- V9: Añadir recargo "para llevar" (takeaway_fee) configurable en site_setting
ALTER TABLE site_setting ADD COLUMN takeaway_fee NUMERIC(8,2) NOT NULL DEFAULT 1.00;
