import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, DollarSign, MapPin, Phone, User, MessageSquare, Clock, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Order } from '../types';

const PROFILE_KEY = 'mzk_customer_profile';
const ORDER_HISTORY_KEY = 'mzk_customer_orders_history';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    totalAmount,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    setActiveOrderSuccess,
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved profile data when opened
  useEffect(() => {
    if (isCheckoutOpen) {
      try {
        const saved = localStorage.getItem(PROFILE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name && !name) setName(parsed.name);
          if (parsed.phone && !phone) setPhone(parsed.phone);
          if (parsed.address && !address) setAddress(parsed.address);
          if (parsed.notes && !notes) setNotes(parsed.notes);
        }
      } catch (e) {
        console.error('Failed reading saved profile:', e);
      }
    }
  }, [isCheckoutOpen]);

  // Lock background scroll without shifting
  useEffect(() => {
    if (isCheckoutOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const validatePakistaniPhone = (num: string): boolean => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '');
    const regex = /^(\+92|92|0)?3[0-9]{9}$/;
    return regex.test(cleaned);
  };

  const isOfferUnlocked = totalAmount >= 1500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your full name (minimum 2 characters).');
      return;
    }

    if (!validatePakistaniPhone(phone)) {
      setError('Please enter a valid Pakistani mobile number (e.g., 03001234567 or 0321-9876543).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setError('Please enter your complete delivery address (House/Apartment, Street, Area).');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        offer_applied: isOfferUnlocked ? 'Free Fresh Fries Box' : undefined,
        honeypot,
        items: items.map((i) => ({
          id: i.item.id,
          quantity: i.quantity,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      // Save customer profile to localStorage for future orders
      try {
        localStorage.setItem(
          PROFILE_KEY,
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            notes: notes.trim(),
          })
        );

        // Save order to customer history list
        const existingHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]');
        const summary = items.map((i) => `${i.item.name} × ${i.quantity}`).join(', ');
        existingHistory.unshift({
          id: data.order.id,
          order_number: data.order.order_number,
          date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          total: data.order.total || totalAmount,
          items_summary: summary,
          status: 'Received',
        });
        localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(existingHistory.slice(0, 20)));
      } catch (e) {
        console.error('Failed to update local history:', e);
      }

      const createdOrder: Order = {
        id: data.order.id,
        order_number: data.order.order_number,
        name: data.order.name,
        phone,
        address,
        notes,
        offer_applied: isOfferUnlocked ? 'Free Fresh Fries Box' : undefined,
        items: data.order.items || items.map((i) => ({
          id: i.item.id,
          name: i.item.name,
          price: i.item.price,
          quantity: i.quantity,
          unit_note: i.item.unit_note,
          line_total: i.item.price * i.quantity,
        })),
        total: data.order.total || totalAmount,
        payment_method: 'Cash on Delivery',
        status: 'New',
        created_at: data.order.created_at || new Date().toISOString(),
        whatsapp_status: 'sent',
      };

      clearCart();
      setIsCheckoutOpen(false);
      setActiveOrderSuccess(createdOrder);
    } catch (err: any) {
      console.error('Order checkout submission error:', err);
      setError(err.message || 'Something went wrong while placing your order. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overscroll-contain">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => !isSubmitting && setIsCheckoutOpen(false)}
      />

      {/* Stable, Anchored Modal Box - No unexpected movement or zoom */}
      <div
        className="relative w-full max-w-lg bg-[#FAF4E8] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col border border-[#EBDCC8]"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        {/* Fixed Header */}
        <div className="px-5 py-4 bg-white border-b border-[#EBDCC8] flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#7A1030]">
              Delivery Details
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cash on delivery · Prepared fresh with love
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isSubmitting}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Error Notice (Fixed container to avoid layout jumping) */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name: text-base on mobile prevents iOS auto-zoom */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#7A1030]" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ali Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-base sm:text-sm text-[#2D2424] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A1030] focus:border-transparent transition-all"
            />
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#7A1030]" />
              <span>Mobile Phone Number *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-base sm:text-sm text-[#2D2424] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A1030] focus:border-transparent transition-all"
            />
            <p className="mt-1 text-[11px] text-stone-500">
              We will confirm your order and delivery updates on this number.
            </p>
          </div>

          {/* Complete Delivery Address */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7A1030]" />
              <span>Complete Delivery Address *</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="House/Apartment #, Street, Sector or Landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-base sm:text-sm text-[#2D2424] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A1030] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#7A1030]" />
              <span>Special Instructions (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, extra sauce, call when arrived"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-base sm:text-sm text-[#2D2424] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A1030] focus:border-transparent transition-all"
            />
          </div>

          {/* Honeypot Spam Trap */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="hp_website_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Festive Bonus Active Notification */}
          {isOfferUnlocked && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-emerald-800 text-xs flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Festive Bonus:</strong> Free Fresh Fries Box will be sent with your order!
              </span>
            </div>
          )}

          {/* Payment Method Badge */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#EBDCC8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800">Cash on Delivery (COD)</div>
                <div className="text-[11px] text-stone-500">Pay when your food arrives at your door</div>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          {/* Estimated Delivery Time Notice */}
          <div className="p-3 rounded-2xl bg-white border border-[#EBDCC8] flex items-center gap-2.5 text-xs text-stone-700">
            <Clock className="w-4 h-4 text-[#7A1030] shrink-0" />
            <span>Estimated delivery: <strong>3-4 hours</strong></span>
          </div>

          {/* Order Total Quick Summary */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#EBDCC8] flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">Order Total ({items.length} items):</span>
            <span className="font-serif font-bold text-base text-[#7A1030]">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-[#7A1030] hover:bg-[#600C25] disabled:bg-stone-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Placing Order...</span>
              </>
            ) : (
              <span>Place Order • Rs. {totalAmount.toLocaleString()}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
