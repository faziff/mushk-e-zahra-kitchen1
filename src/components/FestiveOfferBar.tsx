import React from 'react';
import { Sparkles, Gift } from 'lucide-react';

interface FestiveOfferBarProps {
  offerText?: string;
  offerMinAmount?: number;
}

export const FestiveOfferBar: React.FC<FestiveOfferBarProps> = ({
  offerText = 'Festive Special: Free Fresh Fries box on orders above Rs. 1,500!',
}) => {
  return (
    <div className="bg-gradient-to-r from-[#7A1030] via-[#8C1438] to-[#580B22] text-[#FBF3E4] py-1.5 px-4 text-center font-medium tracking-wide text-xs flex items-center justify-center gap-2 border-b border-[#C8A15A]/30 shadow-xs">
      <Gift className="w-3.5 h-3.5 text-[#C8A15A] animate-bounce shrink-0" />
      <span className="font-semibold text-[#FAF4E8]">
        {offerText}
      </span>
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[#C8A15A] text-[11px] font-bold">
        <span>·</span>
        <Sparkles className="w-3 h-3" />
        <span>Auto-Applied at Checkout</span>
      </span>
    </div>
  );
};

interface FestiveOfferCardProps {
  onOrderNow: () => void;
  offerMinAmount?: number;
}

export const FestiveOfferCard: React.FC<FestiveOfferCardProps> = ({
  onOrderNow,
  offerMinAmount = 1500,
}) => {
  return (
    <div className="my-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#7A1030] via-[#650C25] to-[#4A081B] text-white p-5 sm:p-7 shadow-md border border-[#941B3E] flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Decorative Golden Sparkle Effect */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C8A15A]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-[#C8A15A]/40 flex items-center justify-center shrink-0 shadow-inner">
            <Gift className="w-8 h-8 text-[#C8A15A]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C8A15A] text-[#3E2300] font-bold text-[10px] uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Festive Celebration Offer</span>
            </div>
            <h3 className="font-condensed font-bold text-xl sm:text-2xl tracking-tight text-white uppercase">
              Free Fresh Fries Box
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 mt-0.5 max-w-md">
              Order your favorite biryanis, kababs and curries. Spend Rs. {offerMinAmount.toLocaleString()}+ and receive a complimentary box of hot golden fries!
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={onOrderNow}
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#7A1030] hover:bg-[#FAF4E8] font-bold text-xs sm:text-sm rounded-full shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            Order Now & Unlock
          </button>
        </div>
      </div>
    </div>
  );
};
