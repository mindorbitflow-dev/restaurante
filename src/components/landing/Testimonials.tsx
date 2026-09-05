'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function Testimonials() {
  const { testimonials } = useBusiness();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonios" className="py-24 bg-[#080E1E] border-t border-slate-800/80 relative overflow-hidden">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#FBBF24]/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-[#FBBF24]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="font-display text-[#FBBF24] uppercase tracking-widest text-xs font-bold mb-3 gold-underline w-fit mx-auto block">
            Opiniones Reales
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight">
            ¿Qué Dicen Quienes Nos Visitan?
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0E172A] border border-slate-800 shadow-xl relative hover:border-slate-700 transition-all duration-300 group text-left"
            >
              {/* Quote Mark Decoration */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800 group-hover:text-[#FBBF24]/20 transition-colors" />

              <div>
                {/* Star rating rendering */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < test.rating
                          ? 'fill-[#FBBF24] text-[#FBBF24]'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed mb-6 italic">
                  &ldquo;{test.comment}&rdquo;
                </p>
              </div>

              {/* Profile Bio */}
              <div className="flex items-center gap-3 border-t border-slate-800/80 pt-4 mt-4">
                {test.avatar_url ? (
                  <img
                    src={test.avatar_url}
                    alt={test.name}
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#080E1E] border border-slate-700 flex items-center justify-center font-display text-[#FBBF24] font-bold">
                    {test.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-display text-white font-bold text-sm tracking-tight">
                    {test.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-sans uppercase tracking-widest font-medium">
                    Cliente Verificado
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
