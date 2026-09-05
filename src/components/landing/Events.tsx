'use client';

import React from 'react';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function Events() {
  const { events, profile } = useBusiness();

  // Filtrar eventos activos para la landing page
  const activeEvents = events ? events.filter(e => e.is_active) : [];

  // Helper to format date in Spanish: e.g. "05 JUN, 2026"
  const formatDateParts = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
      const year = date.getFullYear();
      const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
      return { day, month, year, time };
    } catch {
      return { day: '12', month: 'JUN', year: 2026, time: '08:00 PM' };
    }
  };

  if (activeEvents.length === 0) return null;

  return (
    <section id="eventos" className="py-24 bg-[#080E1E] border-t border-slate-800/80 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-[130px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-display text-[#FBBF24] uppercase tracking-widest text-xs font-bold mb-3 gold-underline w-fit mx-auto block">
            Experiencias & Novedades
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight">
            Próximos Eventos & Promociones
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeEvents.map((evt) => {
            const { day, month, time } = formatDateParts(evt.event_date);
            const cleanPhone = profile.whatsapp_number.replace(/[^\d+]/g, '');
            const rsvpMsg = encodeURIComponent(`¡Hola! Me gustaría registrarme/reservar mesa para el evento "${evt.title}" programado para el ${day} de ${month} a las ${time}.`);
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${rsvpMsg}`;

            return (
              <div
                key={evt.id}
                className="flex flex-col sm:flex-row rounded-3xl bg-[#0E172A] border border-slate-800 overflow-hidden shadow-2xl hover:border-slate-700 transition-all duration-300 group"
              >
                {/* Event Image */}
                <div className="sm:w-2/5 relative h-56 sm:h-auto min-h-[220px]">
                  <img
                    src={evt.image_url}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 bg-[#080E1E]/90 border border-slate-700 rounded-2xl px-3.5 py-2 flex flex-col items-center justify-center backdrop-blur-md">
                    <span className="font-display text-[#FBBF24] font-black text-xl leading-none">{day}</span>
                    <span className="font-sans text-slate-300 text-[9px] uppercase tracking-widest font-bold mt-0.5">{month}</span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#22C55E] font-bold font-display mb-2">
                      <Sparkles className="w-3 h-3" />
                      Evento Destacado
                    </span>
                    <h3 className="font-display text-white text-xl font-bold tracking-tight leading-tight mb-2 group-hover:text-[#FBBF24] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      {evt.description}
                    </p>
                  </div>

                  {/* Metadata & RSVP */}
                  <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-3">
                    <div className="flex gap-4 text-xs text-slate-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                        {time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#22C55E]" />
                        Comedor Principal
                      </span>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-display uppercase tracking-widest font-black shadow-lg shadow-green-950/40 hover:scale-[1.02] transition-all duration-300"
                    >
                      Reservar por WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
