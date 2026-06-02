'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function Testimonials() {
  const { testimonials } = useBusiness();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonios" className="py-24 bg-[#070709] relative overflow-hidden">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="font-serif text-gold uppercase tracking-widest text-sm font-semibold mb-3 gold-underline w-fit mx-auto block">
            Reseñas
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide leading-tight">
            ¿Qué Dicen Nuestros Clientes?
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 shadow-2xl relative hover:border-gold/25 hover:bg-gold/5 transition-all duration-300 group text-left"
            >
              {/* Quote Mark Decoration */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-gold/10 transition-colors" />

              <div>
                {/* Star rating rendering */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < test.rating
                          ? 'fill-gold text-gold text-glow-gold'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed mb-6 italic">
                  "{test.comment}"
                </p>
              </div>

              {/* Profile Bio */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-4">
                {test.avatar_url ? (
                  <img
                    src={test.avatar_url}
                    alt={test.name}
                    className="w-10 h-10 rounded-full border border-gold/40 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center font-serif text-gold font-bold">
                    {test.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-white font-semibold text-sm tracking-wide">
                    {test.name}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-sans uppercase tracking-widest">
                    Cliente Distinguido
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
