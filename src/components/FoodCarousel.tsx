import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './ImageWithFallback';

interface FoodCarouselProps {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export const FoodCarousel: React.FC<FoodCarouselProps> = ({
  title,
  subtitle,
  items,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart, updateQuantity, getItemQuantity, setSelectedItemForDetail } = useCart();

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-3">
      {/* Header with Title and Desktop Scroll Controls */}
      <div className="flex items-end justify-between mb-3 px-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#C8A15A] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chef's Choice</span>
          </div>
          <h2 className="font-serif font-bold text-lg sm:text-xl text-[#2D2424] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Arrows for Desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-[#EBDCC8] text-stone-600 hover:text-[#7A1030] hover:bg-[#FAF4E8] flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-[#EBDCC8] text-stone-600 hover:text-[#7A1030] hover:bg-[#FAF4E8] flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Smooth Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1"
        tabIndex={0}
        aria-label={`${title} carousel`}
      >
        {items.map((item) => {
          const quantity = getItemQuantity(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemForDetail(item)}
              className="w-44 sm:w-52 shrink-0 bg-white rounded-2xl p-2.5 sm:p-3 border border-[#EBE0D2] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group select-none"
            >
              <div>
                {/* 1:1 Aspect Ratio Food Photo */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-2 shadow-2xs">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-[#7A1030] text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.unit_note && (
                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-stone-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-2xs">
                      {item.unit_note}
                    </span>
                  )}
                </div>

                {/* Dish Name */}
                <h3 className="font-sans font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 group-hover:text-[#7A1030] transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Price & Stepper */}
              <div className="mt-2.5 pt-2 border-t border-[#F5EDE1] flex items-center justify-between gap-1">
                <span className="font-bold text-xs sm:text-sm text-[#7A1030]">
                  Rs. {item.price.toLocaleString()}
                </span>

                <div onClick={(e) => e.stopPropagation()}>
                  {!item.is_available ? (
                    <span className="text-[10px] text-stone-400 font-medium">Sold</span>
                  ) : quantity === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, 1);
                      }}
                      className="w-7 h-7 rounded-full bg-[#7A1030] text-white hover:bg-[#600C25] flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                      aria-label={`Add ${item.name}`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  ) : (
                    <div className="flex items-center bg-[#FAF4E8] border border-[#DFC7AE] rounded-full p-0.5 shadow-2xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, quantity - 1);
                        }}
                        className="w-5 h-5 rounded-full bg-white text-[#7A1030] hover:bg-[#7A1030] hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[#7A1030]">
                        {quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, quantity + 1);
                        }}
                        className="w-5 h-5 rounded-full bg-[#7A1030] text-white hover:bg-[#600C25] flex items-center justify-center font-bold text-xs transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
