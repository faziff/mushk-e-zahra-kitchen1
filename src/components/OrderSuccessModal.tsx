import React from 'react';
import { Check, Clock, Gift, Sparkles, Utensils, ArrowLeft, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderSuccessModal: React.FC = () => {
  const { activeOrderSuccess, setActiveOrderSuccess } = useCart();

  if (!activeOrderSuccess) return null;

  const order = activeOrderSuccess;

  const handleBackToMenu = () => {
    setActiveOrderSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderAgain = () => {
    setActiveOrderSuccess(null);
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF3E4] overflow-y-auto flex flex-col justify-between animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="bg-[#7A1030] text-white py-3 px-4 sm:px-6 shadow-md flex items-center justify-between">
        <span className="font-serif font-bold text-base sm:text-lg tracking-tight">
          Mushk <span className="font-script text-[#C8A15A] text-xl font-normal">e</span> Zahra Kitchen
        </span>
        <button
          onClick={handleBackToMenu}
          className="text-xs text-white/80 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>
      </div>

      {/* Main Full-Screen Thank You Container */}
      <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-auto space-y-6">
        {/* Animated Maroon Checkmark Circle */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
            {/* Pulsing halo */}
            <div className="absolute inset-0 rounded-full bg-[#7A1030]/15 animate-ping" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#7A1030] text-white flex items-center justify-center shadow-xl border-4 border-white">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1030]/10 border border-[#7A1030]/20 text-[#7A1030] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A15A]" />
            <span>Order #{order.order_number} Received</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2424]">
            Thank you, {order.name}!
          </h1>

          {/* Guaranteed Delivery Notice Banner */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBDCC8] shadow-sm space-y-2 text-center">
            <div className="inline-flex items-center gap-2 text-[#7A1030] font-bold text-sm sm:text-base">
              <Clock className="w-5 h-5 text-[#7A1030] animate-pulse" />
              <span>Your order will be delivered within 3-4 hours.</span>
            </div>
            <p className="text-xs text-stone-600 font-normal">
              We will contact you shortly to confirm your order details.
            </p>
          </div>
        </div>

        {/* Order Receipt Summary Card (No phone or address shown for clean privacy) */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBDCC8] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Order Summary</span>
            <span>Cash on Delivery</span>
          </div>

          <div className="space-y-2 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-stone-800">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#FAF4E8] text-[#7A1030] font-bold text-[11px] flex items-center justify-center">
                    {item.quantity}×
                  </span>
                  <span className="font-semibold">{item.name}</span>
                </span>
                <span className="font-bold">Rs. {item.line_total.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Festive Bonus Notice in summary */}
          {order.offer_applied && (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl font-semibold">
              <span className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Festive Bonus: {order.offer_applied}</span>
              </span>
              <span className="uppercase text-[10px] tracking-wider font-bold">Free</span>
            </div>
          )}

          {/* Total Line */}
          <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
            <span className="font-serif font-bold text-sm text-[#7A1030]">Total Amount (COD)</span>
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#7A1030]">
              Rs. {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buttons: Back to Menu & Order Again */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleBackToMenu}
            className="flex-1 py-3.5 px-5 bg-white text-[#7A1030] hover:bg-[#FAF4E8] font-bold text-xs sm:text-sm rounded-2xl border border-[#DFCBB2] shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#C8A15A]" />
            <span>Back to Menu</span>
          </button>

          <button
            onClick={handleOrderAgain}
            className="flex-1 py-3.5 px-5 bg-[#7A1030] text-white hover:bg-[#600C25] font-bold text-xs sm:text-sm rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>Order Again</span>
          </button>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="text-center py-4 text-xs text-stone-500 border-t border-[#EBDCC8]/60 bg-white/40">
        Mushk e Zahra Kitchen · Pure Homemade Quality
      </div>
    </div>
  );
};
