'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import BurgerLogo from '@/components/shared/BurgerLogo';

export default function Hero() {
  const { profile } = useBusiness();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#080E1E] overflow-hidden pt-20">
      {/* Background Image with immersive dark radial vignette overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out scale-105 opacity-35"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1920&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080E1E] via-[#080E1E]/85 to-[#080E1E]/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.12),transparent_60%)]" />

      {/* Elegant Decorative Floating Gold particles */}
      <div className="absolute top-1/4 left-1/10 w-2 h-2 rounded-full bg-amber-400/30 blur-[2px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/12 w-3.5 h-3.5 rounded-full bg-amber-400/20 blur-[3px] animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-yellow-400/40 blur-[1px] animate-pulse"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
        {/* Brand Burger Icon matching mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-3"
        >
          <BurgerLogo className="w-20 h-20 text-[#F59E0B] drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
        </motion.div>

        {/* Dynamic Title with Script Font */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-wider leading-tight mb-2"
        >
          Bienvenido a{' '}
          <span className="font-script text-5xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)] capitalize inline-block">
            {profile.name}
          </span>
        </motion.h1>

        {/* Dynamic Slogan in Script */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-script text-amber-300/90 text-2xl sm:text-3xl lg:text-4xl max-w-2xl leading-relaxed mb-10 tracking-wide drop-shadow-sm"
        >
          &ldquo;{profile.slogan}&rdquo;
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
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FBBF24] hover:bg-amber-400 text-black font-display uppercase tracking-widest text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Ver Menú Completo
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <Link
            href="/menu#reservas"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-700 hover:border-[#FBBF24] text-white font-display uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 bg-slate-900/70 hover:bg-slate-800 transition-all duration-300"
          >
            <Calendar className="w-4.5 h-4.5 text-[#FBBF24]" />
            Reservar Mesa
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade out scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-[#FBBF24] transition-colors cursor-pointer">
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
