'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, Calendar } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useCart } from '@/context/CartContext';

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setMobileMenuOpen(false);
    
    // If not on homepage, navigate to homepage first with hash
    if (pathname !== '/') {
      e.preventDefault();
      router.push(`/${hash}`);
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '#nosotros', isHash: true },
    { name: 'Menú Digital', href: '/menu' },
    { name: 'Eventos', href: '#eventos', isHash: true },
    { name: 'Ubicación', href: '#ubicacion', isHash: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-gold/10 backdrop-blur-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          {profile.logo_url ? (
            <img
              src={profile.logo_url}
              alt={profile.name}
              className="w-10 h-10 rounded-full border border-gold/40 group-hover:border-gold object-cover transition-colors"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center font-serif text-gold font-bold">
              {profile.name.charAt(0)}
            </div>
          )}
          <span className="font-serif text-xl tracking-widest text-white group-hover:text-gold transition-colors">
            {profile.name.toUpperCase()}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => link.isHash && handleNavClick(e, link.href)}
              className={`text-sm tracking-widest uppercase transition-colors relative py-1 group ${
                pathname === link.href ? 'text-gold' : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-amber-accent transition-all duration-300 group-hover:w-full ${
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
            className="relative p-2 text-gray-300 hover:text-gold transition-colors duration-200"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-6 h-6" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gold to-amber-accent text-black font-sans font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Booking CTA */}
          <Link
            href="/menu#reservas"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-gold/50 text-gold bg-gold/5 text-xs font-serif uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 box-glow-gold"
          >
            <Calendar className="w-3.5 h-3.5" />
            Reservar Mesa
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-black/95 backdrop-blur-xl border-t border-white/5 z-40 transition-all duration-300 animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full gap-8 p-4 pb-20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => link.isHash && handleNavClick(e, link.href)}
                className={`text-lg tracking-widest uppercase py-2 ${
                  pathname === link.href ? 'text-gold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Booking Link */}
            <Link
              href="/menu#reservas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold to-amber-accent text-black font-serif text-sm uppercase tracking-widest font-semibold hover:shadow-lg active:scale-95 transition-all mt-4"
            >
              <Calendar className="w-4 h-4" />
              Reservar Mesa
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
