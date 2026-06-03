-- Ejecuta este archivo en Supabase SQL Editor si el panel admin muestra 403 Forbidden.
-- Mantiene lectura publica del sitio y permite escritura solo a usuarios autenticados.

ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read business_profile" ON business_profile;
DROP POLICY IF EXISTS "Admin insert business_profile" ON business_profile;
DROP POLICY IF EXISTS "Admin update business_profile" ON business_profile;
DROP POLICY IF EXISTS "Admin delete business_profile" ON business_profile;
CREATE POLICY "Public read business_profile" ON business_profile FOR SELECT USING (true);
CREATE POLICY "Admin insert business_profile" ON business_profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update business_profile" ON business_profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete business_profile" ON business_profile FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
DROP POLICY IF EXISTS "Admin update categories" ON categories;
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete categories" ON categories FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin insert products" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public create reservations" ON reservations;
DROP POLICY IF EXISTS "Admin read reservations" ON reservations;
DROP POLICY IF EXISTS "Admin update reservations" ON reservations;
DROP POLICY IF EXISTS "Admin delete reservations" ON reservations;
CREATE POLICY "Public create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read reservations" ON reservations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin update reservations" ON reservations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete reservations" ON reservations FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read events" ON events;
DROP POLICY IF EXISTS "Admin insert events" ON events;
DROP POLICY IF EXISTS "Admin update events" ON events;
DROP POLICY IF EXISTS "Admin delete events" ON events;
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Admin insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update events" ON events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete events" ON events FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read gallery" ON gallery;
DROP POLICY IF EXISTS "Admin insert gallery" ON gallery;
DROP POLICY IF EXISTS "Admin update gallery" ON gallery;
DROP POLICY IF EXISTS "Admin delete gallery" ON gallery;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin insert gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update gallery" ON gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete gallery" ON gallery FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin delete testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Admin insert testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete testimonials" ON testimonials FOR DELETE TO authenticated USING (true);
