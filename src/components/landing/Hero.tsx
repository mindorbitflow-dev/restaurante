'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function Hero() {
  const { profile } = useBusiness();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#070709] overflow-hidden pt-20">
      {/* Background Image with immersive dark radial vignette overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1920&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/85 to-bg-dark/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_50%)]" />

      {/* Elegant Decorative Floating Gold particles */}
      <div className="absolute top-1/4 left-1/10 w-2 h-2 rounded-full bg-gold/30 blur-[2px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/12 w-3.5 h-3.5 rounded-full bg-gold/20 blur-[3px] animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-accent/40 blur-[1px] animate-pulse"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
        {/* Decorative Badge 
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest font-semibold mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {profile.name.toUpperCase()} EXCLUSIVIDAD
        </motion.div>

        */}

        {/* Dynamic Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-wider leading-tight mb-6"
        >
          Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-accent to-gold text-glow-gold">{profile.name}</span>
        </motion.h1>

        {/* Dynamic Slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-300 font-serif italic text-base sm:text-xl lg:text-2xl max-w-2xl leading-relaxed mb-10 tracking-wide"
        >
          "{profile.slogan}"
        </motion.p>

        {/* Calls to Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <Link
            href="/menu"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold to-amber-accent text-black font-serif uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300"
          >
            Ver Menú Completo
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/menu#reservas"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-gold text-white font-serif uppercase tracking-widest text-sm font-semibold flex items-center justify-center gap-2 bg-black/40 hover:bg-gold/10 transition-all duration-300"
          >
            <Calendar className="w-4.5 h-4.5 text-gold" />
            Reservar Mesa
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade out scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-gold transition-colors cursor-pointer">
        <span className="text-[10px] uppercase tracking-widest font-sans">Deslizar</span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center py-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-current"
          />
        </div>
      </div>
    </section>
  );
}
