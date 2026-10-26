import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Clock, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  minimumOrder?: number;
  offerMinAmount?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  minimumOrder = 0,
  offerMinAmount = 1500,
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalAmount,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const isBelowMin = minimumOrder > 0 && totalAmount < minimumOrder;
  const amountNeeded = minimumOrder - totalAmount;

  const isOfferUnlocked = totalAmount >= offerMinAmount;
  const offerAmountNeeded = Math.max(0, offerMinAmount - totalAmount);
  const progressPercent = Math.min(100, Math.round((totalAmount / offerMinAmount) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF4E8] flex flex-col shadow-2xl border-l border-[#EADAC5] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#EBDCC8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#7A1030]/10 text-[#7A1030]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#7A1030]">
                  Your Kitchen Cart
                </h2>
                <div className="text-xs text-stone-500">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-500 hover:text-red-700 hover:underline px-2 py-1"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Festive Offer Bar in Cart */}
          {items.length > 0 && (
            <div className="bg-white px-5 py-3 border-b border-[#EBDCC8]/80">
              {isOfferUnlocked ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🎉 Festive Offer Unlocked: Free Fresh Fries Box Included!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-700 font-medium">
                    <span className="flex items-center gap-1.5 text-[#7A1030] font-semibold">
                      <Gift className="w-3.5 h-3.5 text-[#C8A15A]" />
                      <span>Free Fresh Fries Box:</span>
                    </span>
                    <span className="font-bold text-[#7A1030]">Add Rs. {offerAmountNeeded}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/40">
                    <div
                      className="bg-[#7A1030] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#7A1030]/10 flex items-center justify-center text-[#7A1030]">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-800">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 max-w-xs">
                    Explore our aromatic biryanis, signature kababs, burgers, and crispy samosas.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-[#7A1030] hover:bg-[#600C25] text-white text-xs font-semibold rounded-2xl transition-all shadow-xs cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EBDCC8] shadow-xs flex items-center gap-3"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    loading="lazy"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-bold text-sm text-[#2D2424] truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>Rs. {item.price.toLocaleString()}</span>
                      {item.unit_note && <span>· {item.unit_note}</span>}
                    </div>
                    <div className="font-semibold text-xs text-[#7A1030] mt-1">
                      Line Total: Rs. {(item.price * quantity).toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-[#FAF4E8] border border-[#DFC7AE] rounded-xl p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-[#7A1030] hover:bg-[#7A1030] hover:text-white transition-colors shadow-2xs font-bold text-xs cursor-pointer"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#7A1030]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#7A1030] text-white hover:bg-[#600C25] transition-colors shadow-2xs font-bold text-xs cursor-pointer"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#EBDCC8] space-y-3">
              {/* Delivery Time Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF4E8] border border-[#EBDCC8] text-stone-700 text-xs">
                <Clock className="w-4 h-4 text-[#7A1030] shrink-0" />
                <span>Estimated delivery: <strong>3-4 hours</strong></span>
              </div>

              {/* Minimum Order Warning */}
              {isBelowMin && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Minimum order is Rs. {minimumOrder}. Please add Rs. {amountNeeded} more to place order.
                  </span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                {isOfferUnlocked && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Festive Bonus</span>
                    <span>Free Fresh Fries Box</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold text-stone-800">Cash on Delivery</span>
                </div>
                <div className="flex justify-between font-serif text-base sm:text-lg font-bold text-[#7A1030] pt-2 border-t border-stone-100">
                  <span>Grand Total</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckoutClick}
                disabled={isBelowMin}
                className="w-full py-3.5 px-4 bg-[#7A1030] hover:bg-[#600C25] disabled:bg-stone-300 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-between text-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1 font-serif font-bold text-amber-200">
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
