-- Cloudflare D1 Inquiries Schema
-- Database: fotisp-db (168e7737-ecea-4c82-85a3-dbdd1e0c5fae)
-- Project: fotisp-gr-v2 (Astro 5 + Cloudflare Pages Functions)

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  era_mode TEXT NOT NULL DEFAULT '2026',
  ip_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries (email);
