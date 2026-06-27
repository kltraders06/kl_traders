-- ================================================================
--  KL TRADERS — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. CUSTOMERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name        TEXT NOT NULL,
  company_name     TEXT NOT NULL,
  country          TEXT NOT NULL,
  email            TEXT NOT NULL,
  whatsapp         TEXT,
  preferred_comm   TEXT NOT NULL DEFAULT 'Email'
                   CHECK (preferred_comm IN ('Email', 'WhatsApp', 'Both')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS customers_email_idx    ON customers (email);
CREATE INDEX IF NOT EXISTS customers_company_idx  ON customers (company_name);
CREATE INDEX IF NOT EXISTS customers_country_idx  ON customers (country);

-- ── 2. INQUIRIES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id      TEXT NOT NULL UNIQUE,   -- e.g. KLT-20240101-0001
  customer_id     UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  product         TEXT NOT NULL,
  quantity        TEXT,
  inquiry_type    TEXT NOT NULL DEFAULT 'General Inquiry'
                  CHECK (inquiry_type IN (
                    'Import Products',
                    'Export Products',
                    'Distribution Partnership',
                    'Bulk Purchase',
                    'General Inquiry'
                  )),
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN (
                    'new', 'in_review', 'quoted',
                    'negotiating', 'confirmed', 'closed', 'rejected'
                  )),
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_customer_idx   ON inquiries (customer_id);
CREATE INDEX IF NOT EXISTS inquiries_status_idx     ON inquiries (status);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_type_idx       ON inquiries (inquiry_type);

-- ── 3. QUOTES ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id     UUID NOT NULL REFERENCES inquiries (id) ON DELETE CASCADE,
  quote_number   TEXT NOT NULL UNIQUE,   -- e.g. KLT-Q-2024-0001
  file_path      TEXT,                   -- Supabase Storage object path
  file_name      TEXT,
  total_amount   NUMERIC(12,2),
  currency       TEXT NOT NULL DEFAULT 'USD',
  valid_until    DATE,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quotes_inquiry_idx ON quotes (inquiry_id);

-- ── 4. INVOICES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id      UUID NOT NULL REFERENCES inquiries (id) ON DELETE CASCADE,
  quote_id        UUID REFERENCES quotes (id) ON DELETE SET NULL,
  invoice_number  TEXT NOT NULL UNIQUE,  -- e.g. KLT-INV-2024-0001
  file_path       TEXT,                  -- Supabase Storage object path
  file_name       TEXT,
  amount          NUMERIC(12,2),
  currency        TEXT NOT NULL DEFAULT 'USD',
  due_date        DATE,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_inquiry_idx ON invoices (inquiry_id);
CREATE INDEX IF NOT EXISTS invoices_quote_idx   ON invoices (quote_id);

-- ── AUTO-UPDATE updated_at trigger ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── STORAGE BUCKETS ─────────────────────────────────────────────
-- Run these separately in Supabase SQL editor or via Dashboard > Storage

INSERT INTO storage.buckets (id, name, public)
VALUES ('quotes', 'quotes', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

-- ── ROW LEVEL SECURITY ──────────────────────────────────────────
--
-- Architecture:
--   • The public contact form submits to POST /api/inquiries, which runs
--     on the server using the service_role key. The service role bypasses
--     RLS entirely, so no anon policy is needed for that flow.
--
--   • The anon INSERT policies below are defence-in-depth: they ensure
--     that even if the anon key were used directly from the browser,
--     it could only insert (never read, update, or delete) customer/inquiry
--     rows. All admin reads/writes go through the service_role key server-side.
--
--   • quotes and invoices have no anon policies — they are only accessible
--     via server-side API routes using the service_role key.

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices  ENABLE ROW LEVEL SECURITY;

-- Defence-in-depth: allow anon INSERT only (no SELECT, UPDATE, DELETE)
CREATE POLICY "public_insert_customers" ON customers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "public_insert_inquiries" ON inquiries
  FOR INSERT TO anon WITH CHECK (true);

-- Storage: only the service_role key can upload/read.
-- These policies apply to authenticated (Supabase Auth) users.
-- Since we use the service_role key server-side (which bypasses storage RLS),
-- these are also defence-in-depth for if Supabase Auth is added later.
CREATE POLICY "admin_quotes_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'quotes');

CREATE POLICY "admin_invoices_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "admin_product_images_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "admin_certificates_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "admin_quotes_read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'quotes');

CREATE POLICY "admin_invoices_read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'invoices');

CREATE POLICY "admin_product_images_read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "admin_certificates_read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'certificates');

-- ── HELPER VIEW: inquiries with customer details ─────────────────
CREATE OR REPLACE VIEW inquiries_with_customers
  WITH (security_invoker = true) AS
  SELECT
    i.*,
    c.full_name,
    c.company_name,
    c.country,
    c.email,
    c.whatsapp,
    c.preferred_comm
  FROM inquiries i
  JOIN customers c ON c.id = i.customer_id;
