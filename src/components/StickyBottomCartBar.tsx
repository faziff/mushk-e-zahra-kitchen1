import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StickyBottomCartBar: React.FC = () => {
  const { totalCount, totalAmount, setIsCartOpen } = useCart();

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-[#7A1030] text-white p-4 rounded-2xl shadow-xl border border-[#941B3E] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer"
        aria-label="Open Cart"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-[#580B22] p-2 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-[#C8A15A]" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#C8A15A] text-[#3E2300] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </div>
          <div className="text-left">
            <div className="text-xs text-stone-200">View Cart</div>
            <div className="text-sm font-bold tracking-tight">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg text-amber-200">
            Rs. {totalAmount.toLocaleString()}
          </span>
          <ArrowRight className="w-4 h-4 text-[#C8A15A]" />
        </div>
      </button>
    </div>
  );
};
