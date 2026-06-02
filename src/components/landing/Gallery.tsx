'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function Gallery() {
  const { gallery } = useBusiness();
  const [activeFilter, setActiveFilter] = useState('todo');

  const filterCategories = [
    { label: 'Todo', id: 'todo' },
    { label: 'Comida', id: 'comida' },
    { label: 'Bebidas/Bar', id: 'bebidas' },
    { label: 'Lugar/Lounge', id: 'lugar' },
  ];

  // If no images
  if (!gallery || gallery.length === 0) return null;

  const filteredImages = activeFilter === 'todo'
    ? gallery
    : gallery.filter((img) => img.category.toLowerCase() === activeFilter);

  return (
    <section id="galeria" className="py-24 bg-[#0A0A0C] border-t border-white/5 relative overflow-hidden">
      {/* Decorative Blur Background Ball */}
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-serif text-gold uppercase tracking-widest text-sm font-semibold mb-3 gold-underline w-fit mx-auto block">
            Visuales Premium
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide leading-tight">
            Galería del Lugar & Platos
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full font-serif text-xs uppercase tracking-widest transition-all duration-300 ${
                activeFilter === cat.id
                  ? 'bg-gradient-to-r from-gold to-amber-accent text-black font-bold shadow-lg'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-gold hover:border-gold/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black aspect-square cursor-pointer shadow-xl transition-all duration-300"
            >
              {/* Image with zoom transition */}
              <img
                src={img.image_url}
                alt={img.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gold font-semibold font-serif mb-2">
                  <Camera className="w-3 h-3" />
                  {img.category}
                </span>
                <h4 className="font-serif text-white text-base font-bold tracking-wide leading-snug">
                  {img.caption}
                </h4>
              </div>

              {/* Gold corners decoration */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/50 transition-colors duration-300 rounded-tl-sm"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold/0 group-hover:border-gold/50 transition-colors duration-300 rounded-tr-sm"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold/0 group-hover:border-gold/50 transition-colors duration-300 rounded-bl-sm"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/50 transition-colors duration-300 rounded-br-sm"></div>
            </div>
          ))}
        </div>

        {/* Fallback if filtered list empty */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-serif text-sm">No hay imágenes en esta categoría.</p>
          </div>
        )}

      </div>
    </section>
  );
}
