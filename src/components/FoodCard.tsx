import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './ImageWithFallback';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart, updateQuantity, getItemQuantity, setSelectedItemForDetail } = useCart();
  const quantity = getItemQuantity(item.id);

  const handleCardClick = () => {
    setSelectedItemForDetail(item);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity + 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-[20px] p-2.5 sm:p-3.5 border border-[#EBE0D2]/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group active:scale-[0.99]"
    >
      <div>
        {/* 1:1 Aspect Ratio Food Photo with ImageWithFallback */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 mb-2.5 shadow-2xs">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            width={400}
            height={400}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              !item.is_available ? 'grayscale opacity-60' : ''
            }`}
          />

          {/* Small tag chips on top: Bestseller / Popular / Chef Special */}
          {item.badge && item.is_available && (
            <span className="absolute top-2 left-2 bg-[#7A1030] text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              {item.badge}
            </span>
          )}

          {!item.is_available && (
            <span className="absolute top-2 left-2 bg-stone-900/80 text-white font-bold text-[9px] px-2 py-0.5 rounded-full backdrop-blur-xs">
              Out of Stock
            </span>
          )}

          {item.unit_note && (
            <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-stone-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-2xs border border-stone-100">
              {item.unit_note}
            </span>
          )}
        </div>

        {/* Item Name (2 lines max, bold, compact) */}
        <h3 className="font-sans font-bold text-xs sm:text-sm text-stone-900 line-clamp-2 leading-tight group-hover:text-[#7A1030] transition-colors">
          {item.name}
        </h3>

        {/* 1-line short description */}
        <p className="mt-1 text-[11px] text-stone-500 line-clamp-1 leading-normal">
          {item.description}
        </p>
      </div>

      {/* Price & Action Row */}
      <div className="mt-2.5 pt-2 border-t border-[#F5EDE1] flex items-center justify-between gap-1">
        {/* Maroon Price */}
        <div className="font-bold text-xs sm:text-sm text-[#7A1030]">
          Rs. {item.price.toLocaleString()}
        </div>

        {/* Add Button or Compact Stepper */}
        <div onClick={(e) => e.stopPropagation()}>
          {!item.is_available ? (
            <span className="text-[10px] text-stone-400 font-medium">Sold</span>
          ) : quantity === 0 ? (
            <button
              onClick={handleAddClick}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7A1030] text-white hover:bg-[#600C25] flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div className="flex items-center bg-[#FAF4E8] border border-[#DFC7AE] rounded-full p-0.5 shadow-2xs">
              <button
                onClick={handleDecrement}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-[#7A1030] hover:bg-[#7A1030] hover:text-white flex items-center justify-center font-bold text-xs shadow-2xs active:scale-90 transition-colors"
                aria-label="Decrease"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="w-5 sm:w-6 text-center text-xs font-bold text-[#7A1030]">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#7A1030] text-white hover:bg-[#600C25] flex items-center justify-center font-bold text-xs shadow-2xs active:scale-90 transition-colors"
                aria-label="Increase"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
