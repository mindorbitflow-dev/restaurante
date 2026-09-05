'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, Calendar } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useCart } from '@/context/CartContext';

import BurgerLogo from '@/components/shared/BurgerLogo';

export default function Header() {
  const { profile } = useBusiness();
  const { getCartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detect scroll to apply solid background to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isHash?: boolean) => {
    setMobileMenuOpen(false);
    
    if (isHash) {
      if (pathname !== '/') {
        e.preventDefault();
        router.push(`/${href}`);
      } else {
        const id = href.replace('#', '');
        const elem = document.getElementById(id);
        if (elem) {
          e.preventDefault();
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Menú Digital', href: '/menu' },
    { name: 'Nosotros', href: '#nosotros', isHash: true },
    { name: 'Eventos', href: '#eventos', isHash: true },
    { name: 'Ubicación', href: '#ubicacion', isHash: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#080E1E]/95 shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-slate-800/80 backdrop-blur-lg py-2.5'
            : 'bg-[#080E1E]/80 backdrop-blur-md py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#22C55E] hover:text-white transition-colors touch-manipulation cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Center: Brand Identity Logo & Handwriting text */}
          <Link href="/" className="flex flex-col items-center group text-center select-none">
            <BurgerLogo className="w-7 h-7 sm:w-8 sm:h-8 text-[#F59E0B] group-hover:scale-105 transition-transform" />
            <span className="font-script text-2xl sm:text-3xl text-white font-bold tracking-wide -mt-0.5 leading-none">
              {profile.name}
            </span>
            <span className="font-script text-xs sm:text-sm text-[#FBBF24] font-semibold tracking-wider -mt-0.5">
              {profile.slogan}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.isHash)}
                className={`font-display text-xs tracking-widest uppercase transition-colors relative py-1 group font-bold ${
                  pathname === link.href ? 'text-[#FBBF24]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-[#FBBF24] transition-all duration-300 group-hover:w-full ${
                    pathname === link.href ? 'w-full' : ''
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-300 hover:text-[#FBBF24] transition-colors duration-200 touch-manipulation cursor-pointer"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FBBF24] text-black font-sans font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Booking CTA (Desktop) */}
            <Link
              href="/menu#reservas"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 text-[#FBBF24] bg-slate-900/60 text-xs font-display uppercase tracking-wider font-bold hover:bg-[#FBBF24] hover:text-black hover:border-[#FBBF24] transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              Reservar Mesa
            </Link>
          </div>
        </div>
      </header>

      {/* Standalone Full-Screen Mobile Drawer (unclipped by header's backdrop-filter) */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-[#080E1E] flex flex-col justify-between animate-fade-in"
          style={{ minHeight: '100dvh' }}
        >
          {/* Top Header of Mobile Drawer */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080E1E]">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <BurgerLogo className="w-7 h-7 text-[#F59E0B]" />
              <span className="font-script text-2xl text-white font-bold">
                {profile.name}
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-full text-slate-300 hover:text-white bg-white/5 active:bg-white/10 touch-manipulation cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-4 p-6 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.isHash)}
                className={`font-display text-base tracking-widest uppercase py-3.5 px-8 rounded-full font-bold transition-all w-full text-center max-w-xs touch-manipulation cursor-pointer ${
                  pathname === link.href 
                    ? 'bg-[#FBBF24] text-black shadow-lg shadow-amber-500/20' 
                    : 'text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Booking Link */}
            <Link
              href="/menu#reservas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full max-w-xs py-3.5 px-6 rounded-full bg-[#16A34A] text-white font-display text-xs uppercase tracking-widest font-bold shadow-lg shadow-green-950/40 active:scale-95 transition-all mt-2 touch-manipulation cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Reservar Mesa
            </Link>
          </nav>

          {/* Bottom Info Bar */}
          <div className="p-6 border-t border-slate-800 text-center bg-black/40">
            <p className="font-script text-lg text-[#FBBF24] font-bold mb-0.5">
              {profile.slogan}
            </p>
            <p className="text-xs text-slate-400 font-sans truncate">
              {profile.address}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
