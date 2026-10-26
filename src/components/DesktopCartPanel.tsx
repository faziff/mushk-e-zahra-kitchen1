import React from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Clock, Gift, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface DesktopCartPanelProps {
  offerMinAmount?: number;
}

export const DesktopCartPanel: React.FC<DesktopCartPanelProps> = ({
  offerMinAmount = 1500,
}) => {
  const {
    items,
    totalCount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
  } = useCart();

  const isOfferUnlocked = totalAmount >= offerMinAmount;
  const amountNeeded = Math.max(0, offerMinAmount - totalAmount);
  const progressPercent = Math.min(100, Math.round((totalAmount / offerMinAmount) * 100));

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 bg-white rounded-3xl p-4 border border-[#EBDCC8] shadow-sm flex flex-col max-h-[calc(100vh-7rem)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F5EDE1]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#7A1030]/10 text-[#7A1030]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#7A1030]">Your Cart</h3>
              <span className="text-[11px] text-stone-500">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Festive Offer Progress Bar */}
        <div className="py-2.5 border-b border-[#F5EDE1]">
          {isOfferUnlocked ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free Fresh Fries Box Unlocked!</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span className="flex items-center gap-1 font-medium text-[#7A1030]">
                  <Gift className="w-3 h-3 text-[#C8A15A]" />
                  <span>Free Fries Offer:</span>
                </span>
                <span className="font-bold text-[#7A1030]">Add Rs. {amountNeeded}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#7A1030] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {items.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto stroke-1 text-stone-300" />
              <p className="text-xs">Your cart is empty.</p>
              <p className="text-[11px] text-stone-400">Click "+" on any dish to add.</p>
            </div>
          ) : (
            items.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="bg-[#FAF4E8] rounded-2xl p-2.5 border border-[#EBDCC8]/80 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-stone-900 truncate leading-tight">
                    {item.name}
                  </h4>
                  <div className="text-[11px] font-bold text-[#7A1030] mt-0.5">
                    Rs. {(item.price * quantity).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center bg-white border border-[#DFC7AE] rounded-full p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[#7A1030] hover:bg-[#7A1030] hover:text-white transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-[#7A1030]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      className="w-5 h-5 rounded-full bg-[#7A1030] text-white hover:bg-[#600C25] flex items-center justify-center transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="pt-3 border-t border-[#F5EDE1] space-y-2.5">
            {/* Delivery time guarantee notice */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium bg-[#FAF4E8] px-2.5 py-1.5 rounded-xl border border-[#EBDCC8]">
              <Clock className="w-3.5 h-3.5 text-[#7A1030] shrink-0" />
              <span>Estimated delivery: <strong>3-4 hours</strong></span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Total Amount:</span>
              <span className="font-serif font-bold text-base text-[#7A1030]">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-2.5 px-4 bg-[#7A1030] hover:bg-[#600C25] text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-between text-xs cursor-pointer"
            >
              <span>Checkout</span>
              <div className="flex items-center gap-1">
                <span>Rs. {totalAmount.toLocaleString()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
