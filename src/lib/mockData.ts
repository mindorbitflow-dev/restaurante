import { BusinessProfile, Category, Product, Event, GalleryImage, Testimonial } from './types';

export const mockBusinessProfile: BusinessProfile = {
  name: "King Blacked",
  slogan: "Experiencia Gastronómica & Alta Coctelería",
  logo_url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=120&h=120&fit=crop&q=80",
  about_text: "En King Blacked fusionamos la sofisticación culinaria con la magia de la noche. Nuestro bar y restaurante de diseño contemporáneo es el punto de encuentro idóneo para quienes buscan deleitar sus sentidos. Ofrecemos carnes maduradas premium, creaciones de autor a cargo de chefs internacionales y una carta de coctelería exótica que redefine los clásicos. Todo ello enmarcado en una atmósfera elegante con sutiles detalles dorados y una selecta programación musical en vivo.",
  about_image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&fit=crop",
  whatsapp_number: "+573001234567",
  address: "Vía de la Elegancia # 12-45, Zona Rosa, Bogotá, Colombia",
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15905.977905896677!2d-74.05370339999999!3d4.6738919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a74fb91dfaf%3A0xe54dcf9c2794eb09!2sZona%20T%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco",
  working_hours: {
    "Lunes a Miércoles": "04:00 PM - 11:30 PM",
    "Jueves y Viernes": "03:00 PM - 02:00 AM",
    "Sábados": "01:00 PM - 03:00 AM",
    "Domingos y Festivos": "01:00 PM - 10:30 PM"
  },
  social_links: {
    facebook: "https://facebook.com/profile.php?id=61583016993082",
    instagram: "https://instagram.com/mindorbitflow",
    twitter: "https://twitter.com/mindorbitflow",
    tiktok: "https://tiktok.com/@mindorbitflow"
  },
  theme_colors: {
    primary: "#D4AF37", // Elegant Gold / Amber
    secondary: "#F59E0B",
    background: "#0A0A0C"
  },
  seo_metadata: {
    title: "King Blacked | Bar & Restaurante Exclusivo",
    description: "Disfruta de la mejor cocina fusión, cortes de carne premium y coctelería de autor en una atmósfera exclusiva e inigualable. ¡Reserva tu mesa hoy!",
    keywords: "restaurante bogota, bar de lujo, alta cocteleria, carnes premium, discoteca elegante, reserva de mesas"
  }
};

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Entradas", slug: "entradas", order_index: 1, is_active: true },
  { id: "cat-2", name: "Platos Fuertes", slug: "platos-fuertes", order_index: 2, is_active: true },
  { id: "cat-3", name: "Bebidas", slug: "bebidas", order_index: 3, is_active: true },
  { id: "cat-4", name: "Cócteles", slug: "cocteles", order_index: 4, is_active: true },
  { id: "cat-5", name: "Postres", slug: "postres", order_index: 5, is_active: true },
  { id: "cat-6", name: "Promociones", slug: "promociones", order_index: 6, is_active: true }
];

export const mockProducts: Product[] = [
  // Entradas
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Nachos de la Casa Premium",
    description: "Totopos de maíz crujientes bañados en cheddar fundido artesanal, frijoles negros, pico de gallo cítrico, jalapeños en escabeche y crema agria con un toque de cilantro.",
    price: 32000,
    image_url: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&fit=crop&q=80",
    tags: ["Para Compartir", "Popular"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    name: "Ceviche Citrus Mango",
    description: "Cubos de pescado blanco marinado en leche de tigre de maracuyá, cebolla morada pluma, maíz tostado chulpe, camote dulce y cubitos de mango fresco.",
    price: 38000,
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&fit=crop&q=80",
    tags: ["Recomendado", "Fresco"],
    is_available: true,
    is_promotion: false,
    order_index: 2
  },

  // Platos Fuertes
  {
    id: "prod-3",
    category_id: "cat-2",
    name: "Hamburguesa King Blacked",
    description: "200g de selecto corte de res Angus a la parrilla, queso cheddar madurado, tocineta ahumada crujiente caramelizada en maple, cebolla confitada al oporto y salsa secreta en pan brioche artesanal.",
    price: 45000,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&fit=crop&q=80",
    tags: ["Gourmet", "Casa"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },
  {
    id: "prod-4",
    category_id: "cat-2",
    name: "Ribeye Gold Cut (400g)",
    description: "Corte de ribeye premium con una maduración óptima de 28 días, asado a las brasas al término de su elección, bañado en mantequilla noisette aromatizada con romero y ajos asados.",
    price: 98000,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop&q=80",
    tags: ["Madurado", "Premium"],
    is_available: true,
    is_promotion: false,
    order_index: 2
  },

  // Bebidas
  {
    id: "prod-5",
    category_id: "cat-3",
    name: "Limonada Imperial de Coco",
    description: "Deliciosa mezcla refrescante de limones recién exprimidos, crema de coco premium seleccionada, endulzado sutilmente y servido frappé con coco tostado arriba.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&q=80",
    tags: ["Refrescante", "Sin Alcohol"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },

  // Cócteles
  {
    id: "prod-6",
    category_id: "cat-4",
    name: "Mojito Premium de Menta",
    description: "Ron Añejo seleccionado de alta calidad, zumo fresco de lima ácida, hojas frescas de hierbabuena maceradas suavemente, soda y sirope simple, coronado con menta.",
    price: 33000,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&q=80",
    tags: ["Clásico", "Popular"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },
  {
    id: "prod-7",
    category_id: "cat-4",
    name: "Golden Gin & Tonic",
    description: "Ginebra premium infusionada con botánicos cítricos, agua tónica premium helada, frutos rojos de temporada frescos y un spray de infusión de oro comestible.",
    price: 38000,
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&fit=crop&q=80",
    tags: ["Exclusivo", "Fetiche"],
    is_available: true,
    is_promotion: false,
    order_index: 2
  },

  // Postres
  {
    id: "prod-8",
    category_id: "cat-5",
    name: "Volcán de Chocolate Belga",
    description: "Ponqué de chocolate oscuro premium con centro líquido caliente de fudge belga fundido, servido con helado artesanal de vainilla francesa y lluvia de frutos secos caramelizados.",
    price: 24000,
    image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&fit=crop&q=80",
    tags: ["Dulce", "Caliente"],
    is_available: true,
    is_promotion: false,
    order_index: 1
  },
  {
    id: "prod-9",
    category_id: "cat-5",
    name: "Cheesecake Luxury New York",
    description: "Clásico pastel de queso horneado al estilo New York, textura aterciopelada sobre base crujiente de galleta graham, cubierto de compota artesanal de moras azules y fresas salvajes.",
    price: 22000,
    image_url: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=600&fit=crop&q=80",
    tags: ["Frío", "Clásico"],
    is_available: true,
    is_promotion: false,
    order_index: 2
  },

  // Promociones
  {
    id: "prod-10",
    category_id: "cat-6",
    name: "Combo Burguer & Craft Beer",
    description: "Disfruta de nuestra Hamburguesa King Blacked acompañada de papas rústicas de la casa y una cerveza artesanal fría de barril (Rubia, Roja o Negra).",
    price: 49000,
    original_price: 60000,
    image_url: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&fit=crop&q=80",
    tags: ["Descuento", "Recomendado"],
    is_available: true,
    is_promotion: true,
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
