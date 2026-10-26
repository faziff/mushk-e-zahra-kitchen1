import React from 'react';

interface PromoStripProps {
  onOrderNow: () => void;
}

export const PromoStrip: React.FC<PromoStripProps> = ({ onOrderNow }) => {
  return (
    <div className="py-4 my-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBDCC8] shadow-sm flex items-center justify-between gap-3 sm:gap-4 transition-all">
          {/* Left: Chef Hat Badge Icon */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF4E8] border border-[#E0D0BC] flex items-center justify-center shrink-0 shadow-2xs">
              <svg viewBox="0 0 100 100" className="w-7 h-7 sm:w-8 sm:h-8" fill="none">
                <path
                  d="M 28 66 C 18 66 12 58 12 48 C 12 37 20 32 26 31 C 24 20 35 12 48 12 C 60 12 72 18 73 30 C 79 31 88 36 88 47 C 88 58 81 66 71 66 Z"
                  fill="#7A1030"
                />
                <rect x="22" y="68" width="56" height="10" rx="3" fill="#7A1030" />
                <path
                  d="M 50 48 C 48 42 41 40 37 45 C 32 50 38 57 50 63 C 62 57 68 50 63 45 C 59 40 52 42 50 48 Z"
                  fill="#FBF3E4"
                />
              </svg>
            </div>

            {/* Middle: Text details */}
            <div className="min-w-0">
              <h4 className="font-condensed font-bold text-sm sm:text-base text-stone-900 tracking-tight uppercase">
                Fresh. Tasty. Healthy.
              </h4>
              <p className="text-xs text-stone-500 truncate sm:whitespace-normal mt-0.5">
                Authentic homemade dishes delivered hot to your doorstep.
              </p>
            </div>
          </div>

          {/* Right: Maroon Pill Button */}
          <div className="shrink-0">
            <button
              onClick={onOrderNow}
              className="px-4 sm:px-5 py-2 bg-[#7A1030] hover:bg-[#600C25] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
