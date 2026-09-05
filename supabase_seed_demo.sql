-- =====================================================================
-- SCRIPT DE CARGA DE DATOS DE PRUEBA COMPLETOS (SUPABASE)
-- =====================================================================
-- Ejecuta este script en Supabase: SQL Editor -> New query -> Run
-- Carga el catálogo neutral "Tu Negocio" (Sabor que enamora):
-- perfil, categorías, productos, eventos, galería, testimonios y reservas.
-- =====================================================================

-- 1. LIMPIAR TABLAS ANTERIORES PARA EVITAR DUPLICADOS
DELETE FROM products;
DELETE FROM categories;
DELETE FROM events;
DELETE FROM gallery;
DELETE FROM testimonials;
DELETE FROM reservations;
DELETE FROM business_profile;

-- 2. PERFIL DEL NEGOCIO (BUSINESS PROFILE)
INSERT INTO business_profile (
    id,
    name,
    slogan,
    logo_url,
    about_text,
    about_image,
    whatsapp_number,
    address,
    google_maps_embed,
    working_hours,
    social_links,
    theme_colors,
    seo_metadata
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Tu Negocio',
    'Sabor que enamora',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=120&h=120&fit=crop&q=80',
    'En Tu Negocio nos apasiona crear momentos inolvidables a través de sabores auténticos. Cada plato es preparado con ingredientes frescos y seleccionados, combinando recetas tradicionales con un toque contemporáneo. Descubre nuestra propuesta gastronómica y déjate cautivar por el sabor que enamora.',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&fit=crop',
    '+573001234567',
    'Avenida Principal # 45-67, Zona Gastronómica',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15905.977905896677!2d-74.05370339999999!3d4.6738919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a74fb91dfaf%3A0xe54dcf9c2794eb09!2sZona%20T%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco',
    '{"Lunes a Miércoles": "11:30 AM - 10:00 PM", "Jueves y Viernes": "11:30 AM - 11:30 PM", "Sábados": "11:30 AM - 12:00 AM", "Domingos y Festivos": "12:00 PM - 09:30 PM"}'::jsonb,
    '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "twitter": "https://twitter.com", "tiktok": "https://tiktok.com"}'::jsonb,
    '{"primary": "#F59E0B", "secondary": "#22C55E", "background": "#080D1A"}'::jsonb,
    '{"title": "Tu Negocio | Sabor que enamora", "description": "Menú digital interactivo, hamburguesas gourmet, combos irresistibles y pedidos directos a WhatsApp. ¡Pide en línea!", "keywords": "restaurante, menu digital, hamburguesas, combos, pedidos whatsapp, comida rapida gourmet"}'::jsonb
);

-- 3. CATEGORÍAS
INSERT INTO categories (id, name, slug, order_index, is_active) VALUES
('a1111111-1111-1111-1111-111111111111', 'Destacados', 'destacados', 1, true),
('a2222222-2222-2222-2222-222222222222', 'Combos', 'combos', 2, true),
('a3333333-3333-3333-3333-333333333333', 'Hamburguesas', 'hamburguesas', 3, true),
('a4444444-4444-4444-4444-444444444444', 'Bebidas', 'bebidas', 4, true),
('a5555555-5555-5555-5555-555555555555', 'Postres', 'postres', 5, true);

-- 4. PRODUCTOS
INSERT INTO products (
    name,
    category_id,
    description,
    price,
    original_price,
    image_url,
    tags,
    is_available,
    is_promotion,
    order_index
) VALUES
-- Destacados
(
    'Hamburguesa Clásica',
    'a1111111-1111-1111-1111-111111111111',
    'Carne 100% res selecta, lechuga crocante, queso cheddar fundido, rodajas de tomate y salsa artesanal de la casa.',
    18900,
    NULL,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&fit=crop&q=80',
    ARRAY['Popular', '100% Res'],
    true,
    false,
    1
),
(
    'Papas a la Francesa',
    'a1111111-1111-1111-1111-111111111111',
    'Papas cortadas estilo rústico, crujientes por fuera y suaves por dentro, espolvoreadas con sal marina y paprika suave.',
    7900,
    NULL,
    'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&fit=crop&q=80',
    ARRAY['Crujiente', 'Favorito'],
    true,
    false,
    2
),
(
    'Batido de Vainilla Artesanal',
    'a1111111-1111-1111-1111-111111111111',
    'Delicioso batido batido al momento con helado premium de vainilla bourbon y crema chantilly.',
    9900,
    NULL,
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&fit=crop&q=80',
    ARRAY['Artesanal', 'Frío'],
    true,
    false,
    3
),

-- Combos
(
    'Combo Clásico',
    'a2222222-2222-2222-2222-222222222222',
    'Hamburguesa Clásica acompañada de papas a la francesa crujientes y bebida fría a elección.',
    24900,
    28900,
    'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&fit=crop&q=80',
    ARRAY['Descuento', 'Combo'],
    true,
    true,
    1
),
(
    'Combo Dúo Pareja',
    'a2222222-2222-2222-2222-222222222222',
    '2 Hamburguesas Clásicas + porción gigante de papas rústicas + 2 bebidas frías.',
    42900,
    49900,
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&fit=crop&q=80',
    ARRAY['Ahorro', 'Para Dos'],
    true,
    true,
    2
),

-- Hamburguesas
(
    'Hamburguesa Especial Doble Carne',
    'a3333333-3333-3333-3333-333333333333',
    'Doble carne selecta 100% res a la parrilla, doble queso cheddar fundido, tocineta crujiente y cebolla confitada al caramelo.',
    25900,
    NULL,
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&fit=crop&q=80',
    ARRAY['Doble Carne', 'Especial'],
    true,
    false,
    1
),
(
    'Hamburguesa BBQ & Bacon',
    'a3333333-3333-3333-3333-333333333333',
    'Carne jugosa bañada en salsa barbacoa ahumada, tiras de tocineta crujiente, queso suizo y aros de cebolla dorados.',
    23500,
    NULL,
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&fit=crop&q=80',
    ARRAY['BBQ', 'Ahumado'],
    true,
    false,
    2
),

-- Bebidas
(
    'Limonada Natural Fría',
    'a4444444-4444-4444-4444-444444444444',
    'Refrescante zumo de limón recién exprimido, servido frappé con hojas de hierbabuena fresca.',
    6500,
    NULL,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&q=80',
    ARRAY['Natural', 'Refrescante'],
    true,
    false,
    1
),
(
    'Cerveza Artesanal Golden Ale',
    'a4444444-4444-4444-4444-444444444444',
    'Cerveza rubia de cuerpo medio con notas cítricas y maltas tostadas, servida bien fría.',
    12000,
    NULL,
    'https://images.unsplash.com/photo-1608270174689-130843940176?w=600&fit=crop&q=80',
    ARRAY['Artesanal', 'Alcohol'],
    true,
    false,
    2
),

-- Postres
(
    'Sundae de Chocolate Artesanal',
    'a5555555-5555-5555-5555-555555555555',
    'Helado cremoso de vainilla bañado en fudge de chocolate caliente con lluvia de maní tostado y cereza marrasquino.',
    8900,
    NULL,
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&fit=crop&q=80',
    ARRAY['Dulce', 'Cremoso'],
    true,
    false,
    1
),
(
    'Cheesecake de Frutos Rojos',
    'a5555555-5555-5555-5555-555555555555',
    'Base crocante de galleta con crema de queso suave y reducción artesanal de moras, frambuesas y arándanos.',
    12500,
    NULL,
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&fit=crop&q=80',
    ARRAY['Casero', 'Favorito'],
    true,
    false,
    2
);

-- 5. EVENTOS
INSERT INTO events (
    title,
    description,
    event_date,
    image_url,
    is_active
) VALUES
(
    'Noche de Jazz & Coctelería',
    'Disfruta de una velada inigualable con música jazz en vivo a cargo del cuarteto de Nicolás Rozo, acompañado de nuestro bartender estrella que preparará maridajes exclusivos.',
    now() + interval '3 days',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&fit=crop&q=80',
    true
),
(
    'Cata de Vinos & Carnes Maduradas',
    'Una experiencia sensorial premium dirigida por nuestro sommelier invitado. Degusta cuatro variedades de tintos reserva maridados con nuestros mejores cortes asados.',
    now() + interval '7 days',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&fit=crop&q=80',
    true
),
(
    'Noche Acústica & 2x1 en Cócteles',
    'Música en vivo con los mejores covers acústicos y promoción 2x1 en cócteles seleccionados de 7:00 PM a 10:00 PM.',
    now() + interval '12 days',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&fit=crop&q=80',
    true
);

-- 6. GALERÍA DE IMÁGENES
INSERT INTO gallery (image_url, caption, category, order_index) VALUES
('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800', 'Gastronomía Fusión Premium', 'comida', 1),
('https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800', 'Detalle de Repostería Fina', 'comida', 2),
('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800', 'Atmósfera de Nuestra Barra Principal', 'lugar', 3),
('https://images.unsplash.com/photo-1574096079513-d8259312b7a3?q=80&w=800', 'Salas Lounge y Comedor Principal', 'lugar', 4),
('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800', 'Mixología y Cocteles de Autor', 'bebidas', 5);

-- 7. TESTIMONIOS
INSERT INTO testimonials (name, rating, comment, avatar_url, is_active) VALUES
(
    'Alejandra Moreno',
    5,
    '¡Simplemente espectacular! Las hamburguesas tienen un sabor ahumado exquisito y la atención nos fascinó. El lugar es sumamente elegante e ideal para una ocasión especial.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
    true
),
(
    'Carlos Eduardo Mendoza',
    5,
    'La atención al cliente es del más alto nivel. El sistema de reservas online fue sencillísimo y al llegar nuestra mesa estaba lista. Recomiendo ampliamente el combo clásico y la limonada.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    true
),
(
    'Diana Marcela Pérez',
    5,
    'Los eventos de jazz y música acústica son un sueño. Fuimos con mis compañeros de oficina, pedimos hamburguesas y postres artesanales. Volveremos sin duda.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    true
);

-- 8. RESERVAS DE MUESTRA PARA EL PANEL ADMIN
INSERT INTO reservations (
    customer_name,
    customer_phone,
    reservation_date,
    reservation_time,
    num_people,
    comments,
    status
) VALUES
(
    'Juan Pérez',
    '+573001234567',
    CURRENT_DATE + 1,
    '20:30',
    2,
    'Mesa cerca de la música en vivo por favor',
    'pending'
),
(
    'Alejandra Moreno',
    '+573007654321',
    CURRENT_DATE + 2,
    '21:00',
    4,
    'Celebración de cumpleaños familiar',
    'confirmed'
),
(
    'Carlos Mendoza',
    '+573109876543',
    CURRENT_DATE + 3,
    '19:30',
    6,
    'Mesa amplia para cena empresarial',
    'pending'
);
