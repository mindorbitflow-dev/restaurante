'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Tag, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  categoryName,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 when a new product is selected
  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!product) return null;

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const discountPercent =
    product.is_promotion && product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const handleAdd = () => {
    if (!product.is_available) return;
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm touch-manipulation cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0E172A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
          >
            {/* Header / Image Container */}
            <div className="relative w-full h-56 sm:h-64 bg-black/50 shrink-0 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&fit=crop&q=80';
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E172A] via-transparent to-black/50 pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar vista previa"
                className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all touch-manipulation active:scale-90 cursor-pointer shadow-lg z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 items-center z-10">
                {categoryName && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-display font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#FBBF24] border border-[#FBBF24]/30">
                    {categoryName}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-display font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-md">
                    {discountPercent}% DCTO
                  </span>
                )}
              </div>

              {/* Availability Status Badge on Bottom of Image */}
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 z-10">
                {product.is_available ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Disponible para pedir
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/80 border border-red-500/40 text-red-400 backdrop-blur-sm">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Agotado temporalmente
                  </span>
                )}
              </div>
            </div>

            {/* Content Area (Scrollable if height exceeds screen) */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* Product Title & Price */}
              <div>
                <h2
                  id="product-title"
                  className="font-display font-black text-xl sm:text-2xl text-white tracking-wide leading-tight"
                >
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-[#22c55e] font-display font-black text-2xl sm:text-3xl tracking-tight">
                    {formatCOP(product.price)}
                  </span>
                  {product.is_promotion && product.original_price && (
                    <span className="text-slate-500 text-sm sm:text-base line-through font-sans">
                      {formatCOP(product.original_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium bg-white/5 border border-white/10 text-slate-300"
                    >
                      <Tag className="w-3 h-3 text-[#FBBF24]" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Detailed Description */}
              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans mb-1.5">
                  Descripción & Ingredientes
                </h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
                  {product.description || 'Sin descripción detallada disponible para este producto.'}
                </p>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-5 bg-[#080E1E] border-t border-slate-800 shrink-0 space-y-3">
              {/* Quantity selector & Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Cantidad:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#0E172A] border border-slate-700 rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || !product.is_available}
                      aria-label="Disminuir cantidad"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 touch-manipulation cursor-pointer active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center font-display font-bold text-white text-base">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={!product.is_available}
                      aria-label="Aumentar cantidad"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 touch-manipulation cursor-pointer active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-sans">Subtotal</span>
                    <span className="font-display font-extrabold text-[#22c55e] text-base sm:text-lg leading-none">
                      {formatCOP(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.is_available}
                className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-black font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation cursor-pointer min-h-[48px]"
              >
                {product.is_available ? (
                  <>
                    <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                    <span>Añadir al Carrito • {formatCOP(product.price * quantity)}</span>
                  </>
                ) : (
                  <span>Producto No Disponible</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
