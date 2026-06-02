'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
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

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(mockBusinessProfile);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [gallery, setGallery] = useState<GalleryImage[]>(mockGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMock, setIsMock] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Business Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('business_profile')
        .select('*')
        .maybeSingle();

      // If business profile is available, we are successfully fetching from a valid Supabase instance
      if (profileData && !profileErr) {
        setProfile({
          ...mockBusinessProfile, // Fallback fields
          ...profileData,
          working_hours: typeof profileData.working_hours === 'string' 
            ? JSON.parse(profileData.working_hours) 
            : (profileData.working_hours || mockBusinessProfile.working_hours),
          social_links: typeof profileData.social_links === 'string'
            ? JSON.parse(profileData.social_links)
            : (profileData.social_links || mockBusinessProfile.social_links),
          theme_colors: typeof profileData.theme_colors === 'string'
            ? JSON.parse(profileData.theme_colors)
            : (profileData.theme_colors || mockBusinessProfile.theme_colors),
          seo_metadata: typeof profileData.seo_metadata === 'string'
            ? JSON.parse(profileData.seo_metadata)
            : (profileData.seo_metadata || mockBusinessProfile.seo_metadata),
        });
        setIsMock(false);
      } else {
        // Fall back to mock
        setProfile(mockBusinessProfile);
        setIsMock(true);
      }

      // If we are not in Mock mode, load other data from Supabase
      if (profileData && !profileErr) {
        // 2. Fetch Categories
        const { data: catData, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .order('order_index', { ascending: true });
        if (catData && !catErr) setCategories(catData);

        // 3. Fetch Products (filter out soft-deleted items)
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .is('deleted_at', null)
          .order('order_index', { ascending: true });
        if (prodData && !prodErr) {
          // Parse numerical prices in case they come as strings
          const formattedProds = prodData.map((p) => ({
            ...p,
            price: Number(p.price),
            original_price: p.original_price ? Number(p.original_price) : undefined,
          }));
          setProducts(formattedProds);
        }

        // 4. Fetch Events (filter out soft-deleted events)
        const { data: evtData, error: evtErr } = await supabase
          .from('events')
          .select('*')
          .is('deleted_at', null)
          .order('event_date', { ascending: true });
        if (evtData && !evtErr) setEvents(evtData);

        // 5. Fetch Gallery
        const { data: galData, error: galErr } = await supabase
          .from('gallery')
          .select('*')
          .order('order_index', { ascending: true });
        if (galData && !galErr) setGallery(galData);

        // 6. Fetch Testimonials
        const { data: testData, error: testErr } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true);
        if (testData && !testErr) setTestimonials(testData);
      } else {
        // Fallback all lists to mock
        setCategories(mockCategories);
        setProducts(mockProducts);
        setEvents(mockEvents);
        setGallery(mockGallery);
        setTestimonials(mockTestimonials);
      }
    } catch (err) {
      console.error('Error fetching data from Supabase, using mock fallback data:', err);
      setProfile(mockBusinessProfile);
      setCategories(mockCategories);
      setProducts(mockProducts);
      setEvents(mockEvents);
      setGallery(mockGallery);
      setTestimonials(mockTestimonials);
      setIsMock(true);
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
