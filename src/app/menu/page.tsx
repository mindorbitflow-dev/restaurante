'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, AlertCircle, Calendar } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CartSidebar from '@/components/menu-digital/CartSidebar';
import ReservationForm from '@/components/menu-digital/ReservationForm';
import ProductDetailModal from '@/components/menu-digital/ProductDetailModal';
import { Product } from '@/lib/types';

export default function MenuDigitalPage() {
  const { profile, categories, products, loading } = useBusiness();
  const { addToCart, setIsCartOpen, getCartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter products by selected category and search input
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'todo' ? true : prod.category_id === selectedCategory;

    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#080E1E] min-h-screen text-white font-sans flex flex-col justify-between pb-24 sm:pb-28">
      <Header />
      <CartSidebar />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full pt-28 sm:pt-32 flex-1">
        
        {/* Title: NUESTRO MENÚ (matching diseño.jpg) */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-widest uppercase">
            Nuestro Menú
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-sans">
            Selecciona tus platillos favoritos y recíbelos directamente vía WhatsApp.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar hamburguesa, papas, batido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E172A] border border-slate-800 focus:border-[#FBBF24]/50 rounded-full pl-11 pr-5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all font-sans shadow-md"
          />
        </div>

        {/* Category Pills (Horizontal scrollable bar) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2.5 mb-8 pb-2 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setSelectedCategory('todo')}
            className={`px-5 py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer touch-manipulation active:scale-95 select-none ${
              selectedCategory === 'todo'
                ? 'bg-[#FBBF24] text-black shadow-md shadow-amber-500/20'
                : 'bg-[#0E172A] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-display text-xs uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer touch-manipulation active:scale-95 select-none ${
                selectedCategory === cat.id
                  ? 'bg-[#FBBF24] text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#0E172A] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="loader-spinner"></div>
            <p className="font-display text-[#FBBF24] text-xs uppercase tracking-widest font-semibold">
              Cargando Menú...
            </p>
          </div>
        ) : (
          /* Products Grid (Horizontal Card Layout exactly matching diseño.jpg) */
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-[#0E172A] border border-slate-800 hover:border-[#FBBF24]/50 hover:bg-[#111d35] rounded-2xl p-3 sm:p-3.5 flex items-center gap-3.5 shadow-xl transition-all group relative overflow-hidden cursor-pointer touch-manipulation active:scale-[0.99]"
                >
                  {/* Left: Square Food Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/40 shrink-0 relative">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Promotion badge */}
                    {prod.is_promotion && prod.original_price && (
                      <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-display text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-md">
                        Oferta
                      </span>
                    )}

                    {/* Out of stock overlay */}
                    {!prod.is_available && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-1 text-center">
                        <span className="text-red-400 font-bold text-[10px] uppercase tracking-wider">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Content & Price / Add */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <h3 className="text-white font-display font-bold text-sm sm:text-base leading-tight group-hover:text-amber-400 transition-colors truncate">
                        {prod.name}
                      </h3>
                      <p className="text-slate-400 text-[11px] sm:text-xs leading-snug line-clamp-2 mt-1 font-sans">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[#22c55e] font-display font-extrabold text-base sm:text-lg tracking-tight">
                          {formatCOP(prod.price)}
                        </span>
                        {prod.is_promotion && prod.original_price && (
                          <span className="text-slate-500 text-xs line-through font-sans">
                            {formatCOP(prod.original_price)}
                          </span>
                        )}
                      </div>

                      {/* Plus Action Button (Lime green circle with plus icon) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod);
                        }}
                        disabled={!prod.is_available}
                        aria-label={`Añadir ${prod.name}`}
                        className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-black font-extrabold flex items-center justify-center shadow-md active:scale-90 transition-transform disabled:opacity-30 disabled:cursor-not-allowed shrink-0 touch-manipulation cursor-pointer"
                      >
                        <Plus className="w-5 h-5 sm:w-4 sm:h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#0E172A] border border-dashed border-slate-800 rounded-2xl max-w-md mx-auto mb-16">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 font-display text-sm font-semibold">
              No se encontraron productos coincidentes.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
          </div>
        )}

        {/* Section: Reservation Form */}
        <section className="relative z-10 pt-4 pb-12">
          <ReservationForm />
        </section>
      </main>

      {/* STICKY BOTTOM BAR: PEDIR POR WHATSAPP (matching diseño.jpg) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-98 text-white font-display font-extrabold py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(22,163,74,0.55)] text-sm uppercase tracking-wider transition-all duration-300"
        >
          {/* WhatsApp Icon */}
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.415 9.86-9.854.001-2.636-1.02-5.11-2.871-6.963C16.6 1.94 14.135.918 11.998.918 6.562.918 2.14 5.335 2.138 10.774c-.001 1.719.452 3.4 1.311 4.887L2.43 21.053l5.59-1.467" />
            <path d="M12.004 1.916c-4.877 0-8.843 3.966-8.845 8.845a8.8 8.8 0 0 0 1.293 4.582l.142.227-1.127 4.116 4.214-1.105.219.13a8.8 8.8 0 0 0 4.606 1.299c4.877 0 8.843-3.966 8.845-8.845.001-2.336-.908-4.532-2.56-6.187s-3.852-2.563-6.186-2.563zm4.985 12.015c-.273-.137-1.618-.799-1.87-.89-.252-.091-.436-.137-.62.137-.184.274-.712.89-.872 1.073-.16.183-.321.206-.594.069-.273-.137-1.153-.425-2.196-1.355-.812-.724-1.36-1.619-1.52-1.893-.16-.274-.017-.422.12-.558.123-.122.273-.32.41-.48.137-.16.183-.274.275-.457.091-.183.046-.343-.023-.48-.069-.137-.62-1.493-.849-2.042-.224-.544-.47-.47-.643-.478-.166-.008-.356-.01-.546-.01s-.5.07-.76.356c-.26.286-.992.97-1.014 2.368-.021 1.4.992 2.754 1.13 2.937.137.183 1.952 2.98 4.73 4.179.66.285 1.176.455 1.577.582.663.21 1.267.18 1.744.109.531-.079 1.618-.662 1.847-1.302.23-.64.23-1.188.16-1.302-.07-.115-.253-.183-.526-.32z" />
          </svg>
          <span>Pedir por WhatsApp</span>
          {getCartCount() > 0 && (
            <span className="bg-black/30 border border-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>

      {/* Product Detailed Preview Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        categoryName={categories.find((c) => c.id === selectedProduct?.category_id)?.name}
        onAddToCart={(product, quantity) => {
          addToCart(product, quantity);
        }}
      />

      <Footer />
    </div>
  );
}
