'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useBusiness } from '@/context/BusinessContext';

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart();

  const { profile } = useBusiness();

  // Checkout form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!formData.phone.trim()) errors.phone = 'El teléfono es obligatorio.';
    if (!formData.address.trim()) errors.address = 'La dirección es obligatoria.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Compile items text
    const itemsText = items
      .map((item) => `• ${item.quantity} x ${item.product.name} (${formatCOP(item.product.price * item.quantity)})`)
      .join('\n');

    // Compile WhatsApp message
    const message = `Hola, deseo realizar el siguiente pedido:

${itemsText}

Total: ${formatCOP(getCartTotal())}

Nombre: ${formData.name.trim()}
Teléfono: ${formData.phone.trim()}
Dirección: ${formData.address.trim()}
${formData.notes.trim() ? `Observaciones: ${formData.notes.trim()}\n` : ''}
Gracias.`;

    const cleanPhone = profile.whatsapp_number.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear state and close
    clearCart();
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0E172A] border-l border-slate-800/80 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-display text-white text-lg font-bold tracking-wide">
                  Tu Carrito
                </h3>
                <span className="bg-amber-400 text-black text-xs font-black font-sans rounded-full px-2.5 py-0.5 shadow-sm">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-slate-700 mb-4 stroke-1 animate-pulse" />
                  <p className="font-sans font-medium text-slate-300 text-sm">Tu carrito está vacío.</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed font-sans">
                    Explora nuestro menú digital y añade deliciosas hamburguesas, combos y bebidas.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3.5 p-3.5 rounded-2xl bg-[#131C31] border border-slate-800/80 items-center justify-between group shadow-sm hover:border-slate-700 transition-all"
                      >
                        {/* Img & Title */}
                        <div className="flex gap-3 items-center">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <h4 className="font-sans text-white text-xs sm:text-sm font-bold tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                              {item.product.name}
                            </h4>
                            <span className="text-[#22C55E] font-sans text-sm font-black block mt-0.5">
                              {formatCOP(item.product.price)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Counter & Delete */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-[#0E172A] border border-slate-700/80 rounded-full py-1 px-2.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="text-slate-400 hover:text-white p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-xs font-bold font-sans mx-2.5">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="text-slate-400 hover:text-white p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} className="border-t border-white/5 pt-6 space-y-4">
                    <h4 className="font-sans text-white font-bold text-sm tracking-wide mb-2 flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#FBBF24]" />
                      Datos de Entrega
                    </h4>

                    {/* Nombre */}
                    <div>
                      <label htmlFor="checkout-name" className="block text-gray-400 text-xs font-medium mb-1 font-sans">
                        Nombre Completo *
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez"
                        className={`w-full bg-black/40 border ${
                          formErrors.name ? 'border-red-500/50' : 'border-white/10 focus:border-[#FBBF24]/50'
                        } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-sans`}
                      />
                      {formErrors.name && (
                        <span className="text-red-500 text-[10px] block mt-1 font-sans">{formErrors.name}</span>
                      )}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label htmlFor="checkout-phone" className="block text-gray-400 text-xs font-medium mb-1 font-sans">
                        Teléfono Móvil *
                      </label>
                      <input
                        id="checkout-phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ej. 3001234567"
                        className={`w-full bg-black/40 border ${
                          formErrors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-[#FBBF24]/50'
                        } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-sans`}
                      />
                      {formErrors.phone && (
                        <span className="text-red-500 text-[10px] block mt-1 font-sans">{formErrors.phone}</span>
                      )}
                    </div>

                    {/* Dirección */}
                    <div>
                      <label htmlFor="checkout-address" className="block text-gray-400 text-xs font-medium mb-1 font-sans">
                        Dirección de Envío *
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ej. Calle 123 # 45-67 Apto 202"
                        className={`w-full bg-black/40 border ${
                          formErrors.address ? 'border-red-500/50' : 'border-white/10 focus:border-[#FBBF24]/50'
                        } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-sans`}
                      />
                      {formErrors.address && (
                        <span className="text-red-500 text-[10px] block mt-1 font-sans">{formErrors.address}</span>
                      )}
                    </div>

                    {/* Observaciones */}
                    <div>
                      <label htmlFor="checkout-notes" className="block text-gray-400 text-xs font-medium mb-1 font-sans">
                        Observaciones Adicionales
                      </label>
                      <textarea
                        id="checkout-notes"
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Ej. Hamburguesa sin cebolla, traer cambio de $50 mil"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#FBBF24]/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors font-sans resize-none"
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Bottom Total & Button */}
            {items.length > 0 && (
              <div className="p-6 bg-[#080E1E] border-t border-slate-800/80 space-y-4">
                <div className="flex justify-between items-center font-sans text-slate-300">
                  <span className="text-xs uppercase tracking-wider font-semibold">Subtotal</span>
                  <span className="text-sm font-bold text-white">{formatCOP(getCartTotal())}</span>
                </div>
                <div className="flex justify-between items-center font-sans border-t border-slate-800/80 pt-3">
                  <span className="text-sm uppercase tracking-widest font-black text-white">Total a Pagar</span>
                  <span className="text-2xl font-black text-[#22C55E]">
                    {formatCOP(getCartTotal())}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  type="submit"
                  className="w-full mt-3 py-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-sans text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2.5 shadow-xl shadow-green-950/40 hover:scale-[1.02] active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.415 9.86-9.854.001-2.636-1.02-5.11-2.871-6.963C16.6 1.94 14.135.918 11.998.918 6.562.918 2.14 5.335 2.138 10.774c-.001 1.719.452 3.4 1.311 4.887L2.43 21.053l5.59-1.467z" />
                  </svg>
                  Pedir por WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
