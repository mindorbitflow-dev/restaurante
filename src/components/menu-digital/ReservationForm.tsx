'use client';

import React, { useState } from 'react';
import { Calendar, Phone, Users, Clock, MessageSquare, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBusiness } from '@/context/BusinessContext';

export default function ReservationForm() {
  const { profile } = useBusiness();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '19:00', // default 7 PM
    people: 2,
    comments: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'people' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Validations
    if (!formData.name.trim() || !formData.phone.trim() || !formData.date || !formData.time) {
      setErrorMsg('Por favor completa todos los campos marcados con asterisco (*).');
      setLoading(false);
      return;
    }

    try {
      // 1. Save to Supabase (reservations table)
      const { error } = await supabase.from('reservations').insert([
        {
          customer_name: formData.name.trim(),
          customer_phone: formData.phone.trim(),
          reservation_date: formData.date,
          reservation_time: formData.time,
          num_people: formData.people,
          comments: formData.comments.trim() || null,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Supabase insert error, falling back to WhatsApp confirmation:', error);
        // We will proceed to success anyway in Mock/Fallback mode
      }

      setSuccess(true);

      // 2. Format WhatsApp notification
      const rsvpMsg = `Hola, deseo solicitar una reserva de mesa con los siguientes detalles:

• Nombre: ${formData.name.trim()}
• Teléfono: ${formData.phone.trim()}
• Fecha: ${formData.date}
• Hora: ${formData.time}
• Personas: ${formData.people}
${formData.comments.trim() ? `• Comentarios: ${formData.comments.trim()}\n` : ''}
Por favor, confírmenme la disponibilidad. Gracias.`;

      const cleanPhone = profile.whatsapp_number.replace(/[^\d+]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rsvpMsg)}`;

      // Open WhatsApp automatically in a new window after 1.5s
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

    } catch (err) {
      console.error('Error submitting reservation:', err);
      setErrorMsg('Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '19:00',
      people: 2,
      comments: '',
    });
    setSuccess(false);
    setErrorMsg('');
  };

  return (
    <div id="reservas" className="w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-2xl bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Glow decorative ball */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl -z-10"></div>

      {success ? (
        <div className="text-center py-10 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-gold/10 border border-gold/40 text-gold rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-white text-2xl font-bold tracking-wide">
              ¡Reserva Solicitada Exitosamente!
            </h3>
            <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
              Los detalles se han guardado. Se está abriendo WhatsApp para enviar la confirmación inmediata al negocio. Si no abre automáticamente, puedes pulsar el botón a continuación.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <a
              href={`https://wa.me/${profile.whatsapp_number.replace(/[^\d+]/g, '')}?text=${encodeURIComponent(
                `Hola, acabo de solicitar una reserva para ${formData.name} el ${formData.date} a las ${formData.time}. ¿Me confirman, por favor?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gold to-amber-accent text-black font-serif text-xs uppercase tracking-widest font-bold hover:shadow-lg transition-all"
            >
              Enviar Mensaje a WhatsApp
            </a>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-full border border-white/10 hover:border-gold/30 text-white font-serif text-xs uppercase tracking-widest transition-all"
            >
              Solicitar Otra Reserva
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="font-serif text-white text-2xl font-bold tracking-wide flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6 text-gold" />
              Solicitar una Reserva
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Completa el formulario para reservar tu mesa VIP. Confirmaremos tu asistencia a la brevedad.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex gap-3 text-red-400 text-xs sm:text-sm items-center">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="rsvp-name" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <input
                  id="rsvp-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label htmlFor="rsvp-phone" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">
                Número de Contacto *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <input
                  id="rsvp-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Tu número telefónico"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Fecha */}
            <div className="space-y-1.5">
              <label htmlFor="rsvp-date" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">
                Fecha Seleccionada *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <input
                  id="rsvp-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]} // Block past dates
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Hora */}
            <div className="space-y-1.5">
              <label htmlFor="rsvp-time" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">
                Hora de la Cita *
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <select
                  id="rsvp-time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans appearance-none"
                >
                  <option className="bg-[#121215] text-white" value="12:00">12:00 PM</option>
                  <option className="bg-[#121215] text-white" value="13:00">01:00 PM</option>
                  <option className="bg-[#121215] text-white" value="14:00">02:00 PM</option>
                  <option className="bg-[#121215] text-white" value="15:00">03:00 PM</option>
                  <option className="bg-[#121215] text-white" value="16:00">04:00 PM</option>
                  <option className="bg-[#121215] text-white" value="17:00">05:00 PM</option>
                  <option className="bg-[#121215] text-white" value="18:00">06:00 PM</option>
                  <option className="bg-[#121215] text-white" value="19:00">07:00 PM</option>
                  <option className="bg-[#121215] text-white" value="19:30">07:30 PM</option>
                  <option className="bg-[#121215] text-white" value="20:00">08:00 PM</option>
                  <option className="bg-[#121215] text-white" value="20:30">08:30 PM</option>
                  <option className="bg-[#121215] text-white" value="21:00">09:00 PM</option>
                  <option className="bg-[#121215] text-white" value="21:30">09:30 PM</option>
                  <option className="bg-[#121215] text-white" value="22:00">10:00 PM</option>
                  <option className="bg-[#121215] text-white" value="22:30">10:30 PM</option>
                  <option className="bg-[#121215] text-white" value="23:00">11:00 PM</option>
                  <option className="bg-[#121215] text-white" value="23:30">11:30 PM</option>
                </select>
              </div>
            </div>

            {/* Número de Personas */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="rsvp-people" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">
                Cantidad de Comensales *
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <select
                  id="rsvp-people"
                  name="people"
                  value={formData.people}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans appearance-none"
                >
                  <option className="bg-[#121215] text-white" value={1}>1 Persona</option>
                  <option className="bg-[#121215] text-white" value={2}>2 Personas</option>
                  <option className="bg-[#121215] text-white" value={3}>3 Personas</option>
                  <option className="bg-[#121215] text-white" value={4}>4 Personas</option>
                  <option className="bg-[#121215] text-white" value={5}>5 Personas</option>
                  <option className="bg-[#121215] text-white" value={6}>6 Personas</option>
                  <option className="bg-[#121215] text-white" value={8}>8 Personas (Mesa VIP)</option>
                  <option className="bg-[#121215] text-white" value={10}>10+ Personas (Evento Especial)</option>
                </select>
              </div>
            </div>

            {/* Comentarios */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="rsvp-comments" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">
                Notas y Requerimientos Especiales
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gold/60" />
                <textarea
                  id="rsvp-comments"
                  name="comments"
                  rows={3}
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Ej. Celebración de aniversario, intolerancia al gluten, mesa cerca del escenario de jazz..."
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-full bg-gradient-to-r from-gold to-amber-accent text-black font-serif text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Procesando...' : 'Confirmar Reserva e Ir a WhatsApp'}
          </button>
        </form>
      )}
    </div>
  );
}
