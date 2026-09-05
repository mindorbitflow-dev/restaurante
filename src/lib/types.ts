export interface BusinessProfile {
  id?: string;
  name: string;
  slogan: string;
  logo_url: string;
  about_text: string;
  about_image: string;
  whatsapp_number: string;
  address: string;
  google_maps_embed: string;
  working_hours: Record<string, string>;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  theme_colors: {
    primary: string; // e.g. '#D4AF37'
    secondary: string; // e.g. '#F59E0B'
    background: string; // e.g. '#080E1E'
  };
  seo_metadata: {
    title: string;
    description: string;
    keywords?: string;
  };
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  tags: string[];
  is_available: boolean;
  is_promotion: boolean;
  order_index: number;
  created_at?: string;
  deleted_at?: string;
}

export interface Reservation {
  id?: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  num_people: number;
  comments?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  deleted_at?: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  order_index: number;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
