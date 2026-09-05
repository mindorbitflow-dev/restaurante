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
    <section id="galeria" className="py-24 bg-[#080E1E] border-t border-slate-800/80 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-display text-[#FBBF24] uppercase tracking-widest text-xs font-bold mb-3 gold-underline w-fit mx-auto block">
            Galería Fotográfica
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight">
            Nuestros Platos & Instalaciones
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-5 py-2 rounded-full font-display text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#FBBF24] text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#0E172A] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0E172A] aspect-square cursor-pointer shadow-xl transition-all duration-300"
            >
              {/* Image with zoom transition */}
              <img
                src={img.image_url}
                alt={img.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080E1E] via-[#080E1E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#22C55E] font-bold font-display mb-1.5">
                  <Camera className="w-3 h-3" />
                  {img.category}
                </span>
                <h4 className="font-display text-white text-sm font-bold tracking-tight leading-snug">
                  {img.caption}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Fallback if filtered list empty */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-[#0E172A] border border-dashed border-slate-800 rounded-3xl">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-display text-sm font-semibold">No hay imágenes en esta categoría.</p>
          </div>
        )}

      </div>
    </section>
  );
}
