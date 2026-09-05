'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function HoursAndMap() {
  const { profile } = useBusiness();

  return (
    <section id="ubicacion" className="py-24 bg-[#080E1E] border-t border-slate-800/80 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#FBBF24]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-display text-[#FBBF24] uppercase tracking-widest text-xs font-bold mb-3 gold-underline w-fit mx-auto block">
            Encuéntranos
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight">
            Ubicación & Horarios
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Hours & Contacts */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0E172A] border border-slate-800 shadow-xl relative">
            <div>
              <h3 className="font-display text-white text-lg font-bold mb-6 tracking-tight flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Clock className="w-5 h-5 text-[#FBBF24]" />
                Horarios de Apertura
              </h3>
              <ul className="space-y-3.5 text-sm mb-10">
                {Object.entries(profile.working_hours).map(([days, hours]) => (
                  <li key={days} className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                    <span className="text-slate-300 font-sans">{days}</span>
                    <span className="text-[#FBBF24] font-bold font-display tracking-wide">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-white text-lg font-bold mb-6 tracking-tight flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <MapPin className="w-5 h-5 text-[#22C55E]" />
                Contacto Directo
              </h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-relaxed font-sans">{profile.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <p className="text-slate-300 font-sans">
                    Línea de Atención: <a href={`tel:${profile.whatsapp_number}`} className="text-[#22C55E] hover:underline font-bold font-display tracking-wider">{profile.whatsapp_number}</a>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#FBBF24] shrink-0" />
                  <p className="text-slate-300 font-sans">
                    Correo Directo: <a href={`mailto:reservas@${profile.name.toLowerCase().replace(/\s+/g, '')}.com`} className="text-[#FBBF24] hover:underline font-display tracking-wider">reservas@{profile.name.toLowerCase().replace(/\s+/g, '')}.com</a>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Frame */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[350px] lg:min-h-full flex">
            {profile.google_maps_embed ? (
              <iframe
                title="Google Maps Location"
                src={profile.google_maps_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[350px] grayscale contrast-125 invert-[0.9] opacity-85 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full min-h-[350px] bg-[#0E172A] flex flex-col items-center justify-center text-center p-6">
                <MapPin className="w-12 h-12 text-[#FBBF24]/40 mb-3 animate-bounce" />
                <p className="text-slate-400 text-sm font-sans">Google Maps no ha sido configurado en el perfil administrativo.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
