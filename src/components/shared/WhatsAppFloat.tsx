'use client';

import React from 'react';
import { useBusiness } from '@/context/BusinessContext';

export default function WhatsAppFloat() {
  const { profile } = useBusiness();

  if (!profile || !profile.whatsapp_number) return null;

  // Clean phone number for URL (remove non-digits, keep leading plus if necessary)
  const cleanPhone = profile.whatsapp_number.replace(/[^\d+]/g, '');
  const defaultText = encodeURIComponent('¡Hola! Me gustaría hacer una consulta sobre el menú y reservas.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse Outer Rings */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping -z-10 group-hover:animate-none"></span>

      {/* SVG Icon */}
      <svg
        className="w-7 h-7 fill-current transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.415 9.86-9.854.001-2.636-1.02-5.11-2.871-6.963C16.6 1.94 14.135.918 11.998.918 6.562.918 2.14 5.335 2.138 10.774c-.001 1.719.452 3.4 1.311 4.887L2.43 21.053l5.59-1.467group-hover:" />
        <path d="M12.004 1.916c-4.877 0-8.843 3.966-8.845 8.845a8.8 8.8 0 0 0 1.293 4.582l.142.227-1.127 4.116 4.214-1.105.219.13a8.8 8.8 0 0 0 4.606 1.299c4.877 0 8.843-3.966 8.845-8.845.001-2.336-.908-4.532-2.56-6.187s-3.852-2.563-6.186-2.563zm4.985 12.015c-.273-.137-1.618-.799-1.87-.89-.252-.091-.436-.137-.62.137-.184.274-.712.89-.872 1.073-.16.183-.321.206-.594.069-.273-.137-1.153-.425-2.196-1.355-.812-.724-1.36-1.619-1.52-1.893-.16-.274-.017-.422.12-.558.123-.122.273-.32.41-.48.137-.16.183-.274.275-.457.091-.183.046-.343-.023-.48-.069-.137-.62-1.493-.849-2.042-.224-.544-.47-.47-.643-.478-.166-.008-.356-.01-.546-.01s-.5.07-.76.356c-.26.286-.992.97-1.014 2.368-.021 1.4.992 2.754 1.13 2.937.137.183 1.952 2.98 4.73 4.179.66.285 1.176.455 1.577.582.663.21 1.267.18 1.744.109.531-.079 1.618-.662 1.847-1.302.23-.64.23-1.188.16-1.302-.07-.115-.253-.183-.526-.32z" />
      </svg>
    </a>
  );
}
