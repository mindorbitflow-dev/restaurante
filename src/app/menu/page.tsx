'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Utensils, MessageSquare, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import CartSidebar from '@/components/menu-digital/CartSidebar';
import ReservationForm from '@/components/menu-digital/ReservationForm';

export default function MenuDigitalPage() {
  const { profile, categories, products, loading } = useBusiness();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');

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
    const matchesCategory = selectedCategory === 'todo'
      ? true
      : prod.category_id === selectedCategory;
      
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (catId: string) => {
    const category = categories.find((c) => c.id === catId);
    return category ? category.name : 'Otros';
  };

  return (
    <div className="bg-[#0A0A0C] min-h-screen text-white font-sans flex flex-col justify-between">
      <Header />
      <CartSidebar />
      <WhatsAppFloat />

      {/* Banner / Hero Section */}
      <section className="relative py-24 bg-[#070709] border-b border-white/5 overflow-hidden flex items-center justify-center text-center mt-[72px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-black/80 to-[#070709]" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold font-serif font-bold mb-3">
            <Utensils className="w-3 h-3" />
            Experiencia Gastronómica
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-4">
            Nuestro Menú Digital
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed">
            Ordena tus favoritos y te los enviamos directamente a tu mesa o a tu casa vía WhatsApp.
          </p>
        </div>
      </section>

      {/* Digital Menu Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Buscar hamburguesas, cócteles, postres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-full px-6 py-3 text-sm text-white focus:outline-none transition-all font-sans text-center shadow-lg"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto gap-3 mb-12 pb-3 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('todo')}
            className={`px-5 py-2.5 rounded-full font-serif text-xs uppercase tracking-widest transition-all duration-300 shrink-0 ${
              selectedCategory === 'todo'
                ? 'bg-gradient-to-r from-gold to-amber-accent text-black font-bold shadow-lg'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:text-gold hover:border-gold/30'
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-serif text-xs uppercase tracking-widest transition-all duration-300 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-gold to-amber-accent text-black font-bold shadow-lg'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-gold hover:border-gold/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="loader-spinner"></div>
            <p className="font-serif text-gold text-xs uppercase tracking-widest">Cargando Recetas Especiales...</p>
          </div>
        ) : (
          /* Products Grid */
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col justify-between rounded-2xl bg-white/5 border border-white/5 overflow-hidden shadow-2xl relative group hover:border-gold/20 hover:bg-gold/5 transition-all duration-300"
                >
                  {/* Product Image Area */}
                  <div className="relative h-60 w-full overflow-hidden bg-black flex items-center justify-center shrink-0">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Promotion / Discount Badge */}
                    {prod.is_promotion && prod.original_price && (
                      <span className="absolute top-4 left-4 bg-red-600 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                        Oferta -{Math.round(((prod.original_price - prod.price) / prod.original_price) * 100)}%
                      </span>
                    )}

                    {/* Tags */}
                    {prod.tags && prod.tags.length > 0 && (
                      <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap">
                        {prod.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-black/80 border border-gold/30 text-gold font-sans text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Availability Vignette */}
                    {!prod.is_available && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center text-center p-4">
                        <span className="border-2 border-dashed border-red-500 text-red-500 font-serif text-sm font-bold uppercase tracking-widest px-4 py-2 rotate-[-8deg] shadow-lg animate-pulse">
                          Agotado / No disponible
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <span className="text-[9px] uppercase tracking-widest text-gold/60 font-sans font-semibold">
                          {getCategoryName(prod.category_id)}
                        </span>
                      </div>
                      <h3 className="font-serif text-white text-lg font-bold tracking-wide mb-2 leading-tight group-hover:text-gold transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6 font-sans">
                        {prod.description}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      {/* Price container */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-lg font-bold text-gold text-glow-gold">
                          {formatCOP(prod.price)}
                        </span>
                        {prod.is_promotion && prod.original_price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatCOP(prod.original_price)}
                          </span>
                        )}
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => addToCart(prod)}
                        disabled={!prod.is_available}
                        className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-gold hover:bg-gold hover:text-black font-serif text-[10px] uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-30 disabled:border-white/5 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:cursor-not-allowed"
                      >
                        Añadir
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
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl max-w-lg mx-auto mb-24">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-serif text-sm">No se encontraron productos coincidentes.</p>
            <p className="text-xs text-gray-500 mt-2">Prueba modificando tu término de búsqueda o selecciona otra categoría.</p>
          </div>
        )}

        {/* Divider SVG */}
        <div className="flex items-center justify-center gap-4 mb-20 max-w-md mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30"></div>
          <Sparkles className="w-5 h-5 text-gold/40" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30"></div>
        </div>

        {/* Section: Reservation Form */}
        <section className="relative z-10 pt-4 pb-16">
          <ReservationForm />
        </section>

      </main>

      <Footer />
    </div>
  );
}
