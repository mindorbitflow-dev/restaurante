-- =====================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS (SUPABASE)
-- =====================================================================
-- Ejecuta este script en el editor SQL de Supabase (SQL Editor -> New Query)
-- para construir todas las tablas, relaciones y datos de semilla iniciales.
-- =====================================================================

-- 1. CONFIGURACIÓN DEL NEGOCIO (BUSINESS PROFILE)
CREATE TABLE IF NOT EXISTS business_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slogan VARCHAR(500),
    logo_url TEXT,
    about_text TEXT,
    about_image TEXT,
    whatsapp_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    google_maps_embed TEXT,
    working_hours JSONB NOT NULL,
    social_links JSONB NOT NULL,
    theme_colors JSONB NOT NULL,
    seo_metadata JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORÍAS DEL MENÚ
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTOS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    image_url TEXT,
    tags TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_promotion BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 4. RESERVAS
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    num_people INT NOT NULL CHECK (num_people > 0),
    comments TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. EVENTOS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 6. GALERÍA DE IMÁGENES
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    category VARCHAR(50) DEFAULT 'general', -- e.g. 'comida', 'bebidas', 'lugar'
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TESTIMONIOS
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- ROW LEVEL SECURITY / POLÍTICAS
-- =====================================================================

ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read business_profile" ON business_profile;
DROP POLICY IF EXISTS "Authenticated manage business_profile" ON business_profile;
CREATE POLICY "Public read business_profile"
ON business_profile
FOR SELECT
USING (true);
CREATE POLICY "Authenticated manage business_profile"
ON business_profile
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Authenticated manage categories" ON categories;
CREATE POLICY "Public read categories"
ON categories
FOR SELECT
USING (true);
CREATE POLICY "Authenticated manage categories"
ON categories
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Authenticated manage products" ON products;
CREATE POLICY "Public read products"
ON products
FOR SELECT
USING (true);
CREATE POLICY "Authenticated manage products"
ON products
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public create reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated manage reservations" ON reservations;
CREATE POLICY "Public create reservations"
ON reservations
FOR INSERT
WITH CHECK (true);
CREATE POLICY "Authenticated manage reservations"
ON reservations
FOR SELECT
USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update reservations"
ON reservations
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read events" ON events;
DROP POLICY IF EXISTS "Authenticated manage events" ON events;
CREATE POLICY "Public read events"
ON events
FOR SELECT
USING (true);
CREATE POLICY "Authenticated manage events"
ON events
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated manage gallery" ON gallery;
CREATE POLICY "Public read gallery"
ON gallery
FOR SELECT
USING (true);
CREATE POLICY "Authenticated manage gallery"
ON gallery
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated manage testimonials" ON testimonials;
CREATE POLICY "Public read testimonials"
ON testimonials
FOR SELECT
USING (true);
CREATE POLICY "Authenticated manage testimonials"
ON testimonials
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- =====================================================================
-- SEMILLAS / DATOS DE PRUEBA INICIALES (OPCIONAL)
-- =====================================================================

-- Inserción del perfil básico por defecto
    INSERT INTO business_profile (
        name, slogan, logo_url, about_text, about_image, whatsapp_number, address, google_maps_embed, working_hours, social_links, theme_colors, seo_metadata
    ) VALUES (
        'King Blacked',
        'Experiencia Gastronómica & Alta Coctelería',
        'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=120&h=120&fit=crop&q=80',
        'En King Blacked fusionamos la sofisticación culinaria con la magia de la noche. Nuestro bar y restaurante de diseño contemporáneo es el punto de encuentro idóneo para quienes buscan deleitar sus sentidos. Ofrecemos carnes maduradas premium, creaciones de autor a cargo de chefs internacionales y una carta de coctelería exótica que redefine los clásicos.',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&fit=crop',
        '+573001234567',
        'Vía de la Elegancia # 12-45, Zona Rosa, Bogotá, Colombia',
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15905.977905896677!2d-74.05370339999999!3d4.6738919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a74fb91dfaf%3A0xe54dcf9c2794eb09!2sZona%20T%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco',
        '{"Lunes a Miércoles": "04:00 PM - 11:30 PM", "Jueves y Viernes": "03:00 PM - 02:00 AM", "Sábados": "01:00 PM - 03:00 AM", "Domingos y Festivos": "01:00 PM - 10:30 PM"}',
        '{"facebook": "https://facebook.com/kingblacked", "instagram": "https://instagram.com/kingblacked", "twitter": "https://twitter.com/kingblacked", "tiktok": "https://tiktok.com/@kingblacked"}',
        '{"primary": "#D4AF37", "secondary": "#F59E0B", "background": "#0A0A0C"}',
        '{"title": "King Blacked | Bar & Restaurante Exclusivo", "description": "Disfruta de la mejor cocina fusión, cortes de carne premium y coctelería de autor en una atmósfera exclusiva e inigualable. ¡Reserva tu mesa hoy!"}'
    ) ON CONFLICT DO NOTHING;

    -- Inserción de Categorías
    INSERT INTO categories (id, name, slug, order_index, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Entradas', 'entradas', 1, true),
    ('22222222-2222-2222-2222-222222222222', 'Platos Fuertes', 'platos-fuertes', 2, true),
    ('33333333-3333-3333-3333-333333333333', 'Bebidas', 'bebidas', 3, true),
    ('44444444-4444-4444-4444-444444444444', 'Cócteles', 'cocteles', 4, true),
    ('55555555-5555-5555-5555-555555555555', 'Postres', 'postres', 5, true),
    ('66666666-6666-6666-6666-666666666666', 'Promociones', 'promociones', 6, true)
    ON CONFLICT DO NOTHING;

    -- Inserción de Productos Básicos
    INSERT INTO products (name, category_id, description, price, image_url, tags, is_available, is_promotion, order_index) VALUES
    ('Nachos de la Casa Premium', '11111111-1111-1111-1111-111111111111', 'Totopos de maíz crujientes bañados en cheddar fundido artesanal, frijoles negros, pico de gallo cítrico, jalapeños en escabeche y crema agria.', 32000, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&fit=crop&q=80', ARRAY['Para Compartir', 'Popular'], true, false, 1),
    ('Hamburguesa King Blacked', '22222222-2222-2222-2222-222222222222', '200g de selecto corte de res Angus a la parrilla, queso cheddar madurado, tocineta crujiente, cebolla confitada al oporto y salsa secreta en pan brioche.', 45000, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&fit=crop&q=80', ARRAY['Gourmet', 'Casa'], true, false, 1),
    ('Mojito Premium de Menta', '44444444-4444-4444-4444-444444444444', 'Ron Añejo, zumo fresco de lima ácida, hojas frescas de hierbabuena maceradas suavemente, soda y sirope simple.', 33000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&q=80', ARRAY['Clásico', 'Popular'], true, false, 1)
    ON CONFLICT DO NOTHING;
