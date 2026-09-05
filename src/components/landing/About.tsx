'use client';

import React from 'react';
import { ShieldCheck, Award, Flame, GlassWater } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function About() {
  const { profile } = useBusiness();

  const pillars = [
    {
      icon: <Flame className="w-6 h-6 text-[#FBBF24]" />,
      title: 'Sabor Artesanal',
      desc: 'Carne 100% de res seleccionada, pan brioche recién horneado y recetas exclusivas a la parrilla.',
    },
    {
      icon: <GlassWater className="w-6 h-6 text-[#22C55E]" />,
      title: 'Combos & Bebidas',
      desc: 'Acompañamientos crocantes, papas sazonadas, salsas caseras y bebidas refrescantes.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#FBBF24]" />,
      title: 'Pedidos Directos',
      desc: 'Ordena de forma ágil desde el menú digital y recibe confirmación inmediata por WhatsApp.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#22C55E]" />,
      title: 'Demo Gastronómica',
      desc: 'Plataforma digital optimizada para hamburgueserías y restaurantes de comida casual.',
    },
  ];

  return (
    <section id="nosotros" className="relative py-24 bg-[#080E1E] overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[#FBBF24]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Images Grid (Left side) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            {/* Frame */}
            <div className="absolute -inset-3 border border-slate-800 rounded-3xl -z-10"></div>
            
            <div className="space-y-4">
              <img
                src={profile.about_image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&fit=crop'}
                alt="Hamburguesa Gourmet"
                className="w-full h-64 object-cover rounded-2xl border border-slate-800 shadow-xl hover:scale-105 transition-transform duration-500"
              />
              <img
                src={profile.about_image_2 || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&fit=crop&q=80'}
                alt="Papas y Hamburguesas"
                className="w-full h-44 object-cover rounded-2xl border border-slate-800 shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-4 pt-8">
              <img
                src={profile.about_image_3 || 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800'}
                alt="Ambiente Restaurante"
                className="w-full h-44 object-cover rounded-2xl border border-slate-800 shadow-xl hover:scale-105 transition-transform duration-500"
              />
              <img
                src={profile.about_image_4 || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800'}
                alt="Platos Especiales"
                className="w-full h-64 object-cover rounded-2xl border border-slate-800 shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Text Content (Right side) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="font-display text-[#FBBF24] uppercase tracking-widest text-xs font-bold mb-3 gold-underline w-fit">
              Nuestra Esencia
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-wide mb-6 leading-tight">
              Pasión por el Sabor que Enamora
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8 font-sans">
              {profile.about_text}
            </p>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex gap-4 p-4 rounded-2xl bg-[#0E172A] border border-slate-800 hover:border-slate-700 transition-all duration-300"
                >
                  <div className="shrink-0 p-2.5 rounded-xl bg-[#080E1E] border border-slate-800 h-fit">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-white font-bold text-sm mb-1 tracking-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
