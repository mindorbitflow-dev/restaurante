'use client';

import React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CartSidebar from '@/components/menu-digital/CartSidebar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import HoursAndMap from '@/components/landing/HoursAndMap';
import Gallery from '@/components/landing/Gallery';
import Testimonials from '@/components/landing/Testimonials';
import Events from '@/components/landing/Events';

export default function Home() {
  return (
    <div className="bg-[#080E1E] min-h-screen text-white font-sans flex flex-col justify-between scroll-smooth">
      <Header />
      <CartSidebar />
      <WhatsAppFloat />

      <main className="flex-1">
        {/* Landing Sections */}
        <Hero />
        <About />
        <Events />
        <Gallery />
        <Testimonials />
        <HoursAndMap />
      </main>

      <Footer />
    </div>
  );
}
