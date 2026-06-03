'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isDemoModeEnabled, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { BusinessProfile, Category, Product, Event, GalleryImage, Testimonial } from '@/lib/types';
import {
  mockBusinessProfile,
  mockCategories,
  mockProducts,
  mockEvents,
  mockGallery,
  mockTestimonials,
} from '@/lib/mockData';

interface BusinessContextType {
  profile: BusinessProfile;
  categories: Category[];
  products: Product[];
  events: Event[];
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  loading: boolean;
  isMock: boolean;
  refreshData: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

function parseJsonField<T>(value: T | string | null | undefined, fallback: T): T {
  if (typeof value !== 'string') {
    return value || fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse Supabase JSON field:', error);
    return fallback;
  }
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(mockBusinessProfile);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [gallery, setGallery] = useState<GalleryImage[]>(mockGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMock, setIsMock] = useState<boolean>(isDemoModeEnabled);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemoModeEnabled || !isSupabaseConfigured) {
        setProfile(mockBusinessProfile);
        setCategories(mockCategories);
        setProducts(mockProducts);
        setEvents(mockEvents);
        setGallery(mockGallery);
        setTestimonials(mockTestimonials);
        setIsMock(true);
        return;
      }

      setIsMock(false);

      // 1. Fetch Business Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('business_profile')
        .select('*')
        .maybeSingle();

      if (profileErr) {
        throw profileErr;
      }

      if (profileData) {
        setProfile({
          ...mockBusinessProfile,
          ...profileData,
          working_hours: parseJsonField(profileData.working_hours, mockBusinessProfile.working_hours),
          social_links: parseJsonField(profileData.social_links, mockBusinessProfile.social_links),
          theme_colors: parseJsonField(profileData.theme_colors, mockBusinessProfile.theme_colors),
          seo_metadata: parseJsonField(profileData.seo_metadata, mockBusinessProfile.seo_metadata),
        });
      } else {
        console.warn(
          'Supabase is configured, but business_profile has no rows. Run supabase_schema.sql or insert one business profile row.'
        );
        setProfile(mockBusinessProfile);
      }

      // 2. Fetch Categories
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });
      if (catErr) throw catErr;
      setCategories(catData || []);

      // 3. Fetch Products (filter out soft-deleted items)
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .is('deleted_at', null)
        .order('order_index', { ascending: true });
      if (prodErr) throw prodErr;
      const formattedProds = (prodData || []).map((p) => ({
        ...p,
        price: Number(p.price),
        original_price: p.original_price ? Number(p.original_price) : undefined,
      }));
      setProducts(formattedProds);

      // 4. Fetch Events (filter out soft-deleted events)
      const { data: evtData, error: evtErr } = await supabase
        .from('events')
        .select('*')
        .is('deleted_at', null)
        .order('event_date', { ascending: true });
      if (evtErr) throw evtErr;
      setEvents(evtData || []);

      // 5. Fetch Gallery
      const { data: galData, error: galErr } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true });
      if (galErr) throw galErr;
      setGallery(galData || []);

      // 6. Fetch Testimonials
      const { data: testData, error: testErr } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true);
      if (testErr) throw testErr;
      setTestimonials(testData || []);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);

      if (isDemoModeEnabled || !isSupabaseConfigured) {
        setProfile(mockBusinessProfile);
        setCategories(mockCategories);
        setProducts(mockProducts);
        setEvents(mockEvents);
        setGallery(mockGallery);
        setTestimonials(mockTestimonials);
        setIsMock(true);
      } else {
        setIsMock(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <BusinessContext.Provider
      value={{
        profile,
        categories,
        products,
        events,
        gallery,
        testimonials,
        loading,
        isMock,
        refreshData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
