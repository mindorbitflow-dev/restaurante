'use client';

import React from 'react';
import { ShieldCheck, Award, Flame, GlassWater } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function About() {
  const { profile } = useBusiness();

  const pillars = [
    {
      icon: <Flame className="w-6 h-6 text-gold" />,
      title: 'Alta Cocina',
      desc: 'Ingredientes seleccionados de la más alta calidad asados con técnicas tradicionales y modernas.',
    },
    {
      icon: <GlassWater className="w-6 h-6 text-gold" />,
      title: 'Coctelería de Autor',
      desc: 'Mezclas exclusivas inspiradas en ingredientes locales y destilados importados de alta gama.',
    },
    {
      icon: <Award className="w-6 h-6 text-gold" />,
      title: 'Servicio Premium',
      desc: 'Una atención impecable y personalizada que garantiza una experiencia confortable y VIP.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold" />,
      title: 'Arquitectura SaaS',
      desc: 'Plataforma gastronómica adaptable y flexible ideal para múltiples líneas comerciales de restauración.',
    },
  ];

  return (
    <section id="nosotros" className="relative py-24 bg-[#0A0A0C] overflow-hidden">
      {/* Decorative Blur Ambient Lights */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Images Grid (Left side) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            {/* Absolute accent border frame */}
            <div className="absolute -inset-4 border border-gold/10 rounded-2xl -z-10"></div>
            
            <div className="space-y-4">
              <img
                src={profile.about_image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&fit=crop'}
                alt="Platillo Gourmet"
                className="w-full h-64 object-cover rounded-xl border border-white/5 shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <img
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&fit=crop&q=80"
                alt="Coctel Exclusivo"
                className="w-full h-44 object-cover rounded-xl border border-white/5 shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800"
                alt="Atmósfera Bar"
                className="w-full h-44 object-cover rounded-xl border border-white/5 shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800"
                alt="Lounge VIP"
                className="w-full h-64 object-cover rounded-xl border border-white/5 shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Text Content (Right side) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="font-serif text-gold uppercase tracking-widest text-sm font-semibold mb-3 gold-underline w-fit">
              Nuestra Esencia
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide mb-6 leading-tight">
              Donde el Arte Culinario Encuentra la Noche
            </h2>
            <p className="text-gray-300 text-base leading-relaxed mb-8 font-sans">
              {profile.about_text}
            </p>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-gold/5 transition-all duration-300"
                >
                  <div className="shrink-0 p-2 rounded-lg bg-gold/10 h-fit">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-white font-semibold text-sm mb-1 tracking-wide">
                      {pillar.title}
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
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
