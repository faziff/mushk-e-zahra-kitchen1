import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './ImageWithFallback';

export const ItemDetailModal: React.FC = () => {
  const { selectedItemForDetail, setSelectedItemForDetail, addToCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedItemForDetail) {
      const existing = getItemQuantity(selectedItemForDetail.id);
      setQuantity(existing > 0 ? existing : 1);
    }
  }, [selectedItemForDetail]);

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const lineTotal = item.price * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setSelectedItemForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={() => setSelectedItemForDetail(null)}
      />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header Photo Container */}
        <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden shrink-0">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          <button
            onClick={() => setSelectedItemForDetail(null)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Price Pill */}
          <div className="absolute bottom-4 left-4 bg-[#7A1030] text-[#FAF4E8] px-3.5 py-1.5 rounded-full font-serif font-bold text-lg shadow-md border border-[#C8A15A]/30">
            Rs. {item.price.toLocaleString()}
          </div>

          {item.unit_note && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-stone-800 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {item.unit_note}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C8A15A] font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mushk e Zahra Kitchen Specialty</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2D2424] mt-1">
              {item.name}
            </h2>
          </div>

          {/* Description */}
          <p className="text-stone-700 text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Highlights / Ingredients */}
          <div className="bg-[#FAF4E8] rounded-2xl p-4 border border-[#EBDCC8] space-y-2">
            <h4 className="text-xs font-bold text-[#7A1030] uppercase tracking-wider">
              Kitchen Quality Promise
            </h4>
            <ul className="text-xs text-stone-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                <span>Prepared with 100% Halal chicken & whole aromatic spices</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                <span>Zero artificial preservatives or commercial colorings</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#7A1030] shrink-0" />
                <span>Delivered fresh to order within 3-4 hours</span>
              </li>
            </ul>
          </div>

          {/* Quantity Stepper & Price Calculation */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100">
            <div>
              <div className="text-xs text-stone-500 font-medium">Quantity</div>
              <div className="flex items-center gap-3 mt-1.5 bg-[#FAF4E8] border border-[#DFC7AE] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-white text-[#7A1030] hover:bg-[#7A1030] hover:text-white transition-colors flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-base text-[#7A1030]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="w-8 h-8 rounded-xl bg-[#7A1030] text-white hover:bg-[#600C25] transition-colors flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-stone-500 font-medium">Total Price</div>
              <div className="font-serif text-2xl font-bold text-[#7A1030]">
                Rs. {lineTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Add Button */}
        <div className="p-4 sm:p-5 bg-[#FAF4E8]/50 border-t border-[#EBDCC8]">
          <button
            onClick={handleAddToCart}
            disabled={!item.is_available}
            className="w-full py-3.5 px-6 bg-[#7A1030] hover:bg-[#600C25] disabled:bg-stone-300 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#C8A15A]" />
            <span>
              {item.is_available
                ? `Add to Cart • Rs. ${lineTotal.toLocaleString()}`
                : 'Currently Unavailable'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
