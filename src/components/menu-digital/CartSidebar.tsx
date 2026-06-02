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
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#121215] border-l border-gold/15 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-50 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h3 className="font-serif text-white text-lg font-bold tracking-wide">
                  Tu Carrito
                </h3>
                <span className="bg-gold/10 border border-gold/30 text-gold text-xs font-bold font-sans rounded-full px-2 py-0.5">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Middle Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-gray-700 mb-4 stroke-1 animate-pulse" />
                  <p className="font-serif text-gray-400 text-sm">Tu carrito está vacío.</p>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                    Navega por nuestro menú digital y añade deliciosos platillos, bebidas y postres.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 items-center justify-between group"
                      >
                        {/* Img & Title */}
                        <div className="flex gap-3 items-center">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-white/5 shrink-0"
                          />
                          <div>
                            <h4 className="font-serif text-white text-xs sm:text-sm font-bold tracking-wide leading-tight group-hover:text-gold transition-colors">
                              {item.product.name}
                            </h4>
                            <span className="text-gold font-serif text-xs font-semibold block mt-0.5">
                              {formatCOP(item.product.price)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Counter & Delete */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-black/40 border border-white/10 rounded-full py-1 px-2.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-white p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-xs font-bold font-sans mx-2.5">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-white p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
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
                    <h4 className="font-serif text-white font-bold text-sm tracking-wide mb-2 flex items-center gap-2">
                      <Send className="w-4 h-4 text-gold" />
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
                          formErrors.name ? 'border-red-500/50' : 'border-white/10 focus:border-gold/50'
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
                          formErrors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-gold/50'
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
                          formErrors.address ? 'border-red-500/50' : 'border-white/10 focus:border-gold/50'
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
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors font-sans resize-none"
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Bottom Total & Button */}
            {items.length > 0 && (
              <div className="p-6 bg-[#0c0c0e] border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center font-serif text-white">
                  <span className="text-sm uppercase tracking-wider font-semibold">Subtotal</span>
                  <span className="text-base font-bold">{formatCOP(getCartTotal())}</span>
                </div>
                <div className="flex justify-between items-center font-serif text-white border-t border-white/5 pt-3">
                  <span className="text-sm uppercase tracking-widest font-extrabold text-gold">Total de tu Pedido</span>
                  <span className="text-xl font-extrabold text-gold text-glow-gold">
                    {formatCOP(getCartTotal())}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  type="submit"
                  className="w-full mt-2 py-4 rounded-full bg-gradient-to-r from-gold to-amber-accent text-black font-serif text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-98 transition-all duration-300"
                >
                  Enviar Pedido a WhatsApp
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
