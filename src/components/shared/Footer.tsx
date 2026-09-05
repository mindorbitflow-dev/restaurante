'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Music2Icon } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

// Custom SVG components for brand icons to ensure maximum compatibility and zero external dependencies
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

export default function Footer() {
  const { profile } = useBusiness();
  const currentYear = new Date().getFullYear();

  // Social icon mapper
  const getSocialIcon = (key: string) => {
    switch (key) {
      case 'instagram':
        return <InstagramIcon className="w-5 h-5" />;
      case 'facebook':
        return <FacebookIcon className="w-5 h-5" />;
      case 'twitter':
        return <TwitterIcon className="w-5 h-5" />;
      case 'tiktok':
        return <Music2Icon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="relative bg-[#060A14] text-slate-400 pt-16 pb-8 border-t border-slate-800/80 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-[#FBBF24] transition-colors">
                {profile.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 font-script text-[#FBBF24] text-lg">
              &ldquo;{profile.slogan}&rdquo;
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {Object.entries(profile.social_links).map(([key, value]) => {
                if (!value) return null;
                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#0E172A] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#FBBF24] hover:border-[#FBBF24]/50 transition-all duration-300"
                    aria-label={`Seguir en ${key}`}
                  >
                    {getSocialIcon(key)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Hours */}
          <div>
            <h3 className="font-display text-white uppercase tracking-wider text-xs font-bold mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FBBF24]" />
              Horarios de Servicio
            </h3>
            <ul className="space-y-3 text-sm">
              {Object.entries(profile.working_hours).map(([days, hours]) => (
                <li key={days} className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-300 font-sans">{days}</span>
                  <span className="text-[#FBBF24] font-bold font-display">{hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div>
            <h3 className="font-display text-white uppercase tracking-wider text-xs font-bold mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#22C55E]" />
              Contacto y Ubicación
            </h3>
            <ul className="space-y-3.5 text-sm font-sans">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                <span className="text-slate-300">{profile.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-[#22C55E] shrink-0" />
                <a
                  href={`tel:${profile.whatsapp_number}`}
                  className="text-slate-300 hover:text-[#22C55E] transition-colors font-bold font-display"
                >
                  {profile.whatsapp_number}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-[#FBBF24] shrink-0" />
                <a
                  href={`mailto:info@${profile.name.toLowerCase().replace(/\s+/g, '')}.com`}
                  className="text-slate-300 hover:text-[#FBBF24] transition-colors"
                >
                  info@{profile.name.toLowerCase().replace(/\s+/g, '')}.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick menu links */}
          <div>
            <h3 className="font-display text-white uppercase tracking-wider text-xs font-bold mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FBBF24]" />
              Administración
            </h3>
            <p className="text-xs mb-4 leading-relaxed font-sans text-slate-400">
              Módulo exclusivo y protegido para la gestión del catálogo de productos, categorías, horarios y pedidos.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest font-bold text-[#FBBF24] hover:text-white transition-colors duration-200 border-b border-[#FBBF24]/40 hover:border-white pb-0.5"
            >
              Acceso Administrativo
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800/80 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 font-sans text-slate-500">
          <p>
            © {currentYear} {profile.name}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-[#FBBF24] transition-colors cursor-pointer">Restaurante Demo</span>
            <span className="hover:text-[#FBBF24] transition-colors cursor-pointer">Políticas de Privacidad</span>
            <span className="font-semibold text-[#FBBF24]/80">Demo Gastronómica</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
