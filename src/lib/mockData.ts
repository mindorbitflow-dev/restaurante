import { BusinessProfile, Category, Product, Event, GalleryImage, Testimonial } from './types';

export const mockBusinessProfile: BusinessProfile = {
  name: "Tu Negocio",
  slogan: "Sabor que enamora",
  logo_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=120&h=120&fit=crop&q=80",
  about_text: "En Tu Negocio nos apasiona crear momentos inolvidables a través de sabores auténticos. Cada plato es preparado con ingredientes frescos y seleccionados, combinando recetas tradicionales con un toque contemporáneo. Descubre nuestra propuesta gastronómica y déjate cautivar por el sabor que enamora.",
  about_image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&fit=crop",
  whatsapp_number: "+573001234567",
  address: "Avenida Principal # 45-67, Zona Gastronómica",
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15905.977905896677!2d-74.05370339999999!3d4.6738919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a74fb91dfaf%3A0xe54dcf9c2794eb09!2sZona%20T%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco",
  working_hours: {
    "Lunes a Miércoles": "11:30 AM - 10:00 PM",
    "Jueves y Viernes": "11:30 AM - 11:30 PM",
    "Sábados": "11:30 AM - 12:00 AM",
    "Domingos y Festivos": "12:00 PM - 09:30 PM"
  },
  social_links: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    tiktok: "https://tiktok.com"
  },
  theme_colors: {
    primary: "#F59E0B", // Gold / Amber
    secondary: "#22C55E", // Vibrant Green
    background: "#080D1A" // Dark Navy
  },
  seo_metadata: {
    title: "Tu Negocio | Sabor que enamora",
    description: "Menú digital interactivo, hamburguesas gourmet, combos irresistibles y pedidos directos a WhatsApp. ¡Pide en línea!",
    keywords: "restaurante, menu digital, hamburguesas, combos, pedidos whatsapp, comida rapida gourmet"
  }
};

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Destacados", slug: "destacados", order_index: 1, is_active: true },
  { id: "cat-2", name: "Combos", slug: "combos", order_index: 2, is_active: true },
  { id: "cat-3", name: "Hamburguesas", slug: "hamburguesas", order_index: 3, is_active: true },
  { id: "cat-4", name: "Bebidas", slug: "bebidas", order_index: 4, is_active: true },
  { id: "cat-5", name: "Postres", slug: "postres", order_index: 5, is_active: true }
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Hamburguesa Clásica",
    description: "Carne 100% res, lechuga, queso, tomate y salsas especiales.",
    price: 18900,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&fit=crop&q=80",
    tags: ["Popular", "100% Res"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    name: "Papas a la Francesa",
    description: "Crujientes y doradas, acompañamiento ideal.",
    price: 7900,
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&fit=crop&q=80",
    tags: ["Crujiente", "Favorito"],
    is_available: true,
    is_promotion: false,
    order_index: 2
  },
  {
    id: "prod-3",
    category_id: "cat-1",
    name: "Batido de Vainilla",
    description: "Delicioso batido artesanal de vainilla.",
    price: 9900,
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&fit=crop&q=80",
    tags: ["Artesanal", "Frío"],
    is_available: true,
    is_promotion: false,
    order_index: 3
  },
  {
    id: "prod-4",
    category_id: "cat-2",
    name: "Combo Clásico",
    description: "Hamburguesa Clásica acompañada de papas a la francesa crujientes y bebida fría.",
    price: 24900,
    original_price: 28900,
    image_url: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&fit=crop&q=80",
    tags: ["Descuento", "Combo"],
    is_available: true,
    is_promotion: true,
    order_index: 1
  },
  {
    id: "prod-5",
    category_id: "cat-3",
    name: "Hamburguesa Especial Doble Carne",
    description: "Doble carne selecta 100% res, queso cheddar fundido, tocineta crujiente y cebolla confitada.",
    price: 25900,
    image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&fit=crop&q=80",
    tags: ["Doble Carne", "Especial"],
    is_available: true,
    is_promotion: false,
    order_index: 2
  },
  {
    id: "prod-6",
    category_id: "cat-4",
    name: "Limonada Natural Fría",
    description: "Refrescante zumo de limón recién exprimido, servido frappé con hierbabuena fresca.",
    price: 6500,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&q=80",
    tags: ["Natural", "Sin Alcohol"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },
  {
    id: "prod-7",
    category_id: "cat-5",
    name: "Sundae de Chocolate Artesanal",
    description: "Helado cremoso de vainilla bañado en fudge de chocolate caliente con lluvia de maní tostado.",
    price: 8900,
    image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&fit=crop&q=80",
    tags: ["Dulce", "Cremoso"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  }
];

export const mockEvents: Event[] = [
  {
    id: "evt-1",
    title: "Noche de Jazz & Coctelería",
    description: "Disfruta de una velada inigualable con música jazz en vivo a cargo del cuarteto de Nicolás Rozo, acompañado de nuestro bartender estrella que preparará maridajes exclusivos.",
    event_date: "2026-06-05T20:30:00-05:00",
    image_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&fit=crop&q=80",
    is_active: true
  },
  {
    id: "evt-2",
    title: "Cata de Vinos & Carnes Maduradas",
    description: "Una experiencia sensorial premium dirigida por nuestro sommelier invitado. Degusta cuatro variedades de tintos reserva maridados con nuestros mejores cortes asados.",
    event_date: "2026-06-12T19:00:00-05:00",
    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&fit=crop&q=80",
    is_active: true
  }
];

export const mockGallery: GalleryImage[] = [
  {
    id: "gal-1",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    caption: "Gastronomía Fusión Premium",
    category: "comida",
    order_index: 1
  },
  {
    id: "gal-2",
    image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800",
    caption: "Detalle de Repostería Fina",
    category: "comida",
    order_index: 2
  },
  {
    id: "gal-3",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
    caption: "Atmósfera Dorada de Nuestra Barra",
    category: "lugar",
    order_index: 3
  },
  {
    id: "gal-4",
    image_url: "https://images.unsplash.com/photo-1574096079513-d8259312b7a3?q=80&w=800",
    caption: "Salas Lounge y Reservados VIP",
    category: "lugar",
    order_index: 4
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Alejandra Moreno",
    rating: 5,
    comment: "¡Simplemente espectacular! Las hamburguesas tienen un sabor ahumado exquisito y la coctelería dorada nos fascinó. El lugar es sumamente elegante e ideal para una cita especial.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80",
    is_active: true
  },
  {
    id: "test-2",
    name: "Carlos Eduardo Mendoza",
    rating: 5,
    comment: "La atención al cliente es del más alto nivel. El sistema de reservas online fue sencillísimo y al llegar nuestra mesa VIP estaba lista. Recomiendo ampliamente el Ribeye y el Mojito.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    is_active: true
  },
  {
    id: "test-3",
    name: "Diana Marcela Pérez",
    rating: 5,
    comment: "Los eventos de jazz en vivo los viernes son un sueño. Fuimos con mis compañeras de oficina, pedimos nachos premium y cócteles de autor. Volveremos cada quincena sin duda.",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    is_active: true
  }
];
