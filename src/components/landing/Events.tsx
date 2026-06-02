'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
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
    } catch (e) {
      return { day: '12', month: 'JUN', year: 2026, time: '08:00 PM' };
    }
  };

  if (activeEvents.length === 0) return null;

  return (
    <section id="eventos" className="py-24 bg-[#0A0A0C] border-t border-white/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[130px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-serif text-gold uppercase tracking-widest text-sm font-semibold mb-3 gold-underline w-fit mx-auto block">
            Veladas Únicas
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide leading-tight">
            Próximos Eventos & Experiencias
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {activeEvents.map((evt) => {
            const { day, month, time } = formatDateParts(evt.event_date);
            const cleanPhone = profile.whatsapp_number.replace(/[^\d+]/g, '');
            const rsvpMsg = encodeURIComponent(`¡Hola! Me gustaría registrarme/reservar mesa para el evento "${evt.title}" programado para el ${day} de ${month} a las ${time}.`);
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${rsvpMsg}`;

            return (
              <div
                key={evt.id}
                className="flex flex-col sm:flex-row rounded-2xl bg-white/5 border border-white/5 overflow-hidden shadow-2xl hover:border-gold/20 hover:bg-gold/5 transition-all duration-300 group"
              >
                {/* Event Image */}
                <div className="sm:w-2/5 relative h-56 sm:h-auto min-h-[220px]">
                  <img
                    src={evt.image_url}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 bg-black/90 border border-gold/40 rounded-xl px-3.5 py-2 flex flex-col items-center justify-center backdrop-blur-md">
                    <span className="font-serif text-gold font-bold text-xl leading-none">{day}</span>
                    <span className="font-sans text-white text-[9px] uppercase tracking-widest font-semibold mt-0.5">{month}</span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold font-semibold font-serif mb-2">
                      <Sparkles className="w-3 h-3" />
                      Velada Especial
                    </span>
                    <h3 className="font-serif text-white text-xl font-bold tracking-wide leading-tight mb-3 group-hover:text-gold transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {evt.description}
                    </p>
                  </div>

                  {/* Metadata & RSVP */}
                  <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                    <div className="flex gap-4 text-xs text-gray-500 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        {time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        Lounge Principal
                      </span>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-gradient-to-r from-gold to-amber-accent text-black text-xs font-serif uppercase tracking-widest font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-103 transition-all duration-300"
                    >
                      Reservar Entrada por WhatsApp
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
