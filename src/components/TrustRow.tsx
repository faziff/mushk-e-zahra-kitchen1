import React from 'react';
import { Utensils, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const TrustRow: React.FC = () => {
  return (
    <div className="py-2.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-[#EBDCC8] shadow-2xs flex items-center justify-around gap-2 text-stone-700">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#C8A15A] shrink-0" />
            <span className="text-[#2D2424]">Fresh Daily</span>
          </div>

          <span className="text-stone-300 font-bold">·</span>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Utensils className="w-4 h-4 text-[#7A1030] shrink-0" />
            <span className="text-[#2D2424]">100% Halal</span>
          </div>

          <span className="text-stone-300 font-bold">·</span>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#C8A15A] shrink-0" />
            <span className="text-[#2D2424]">Hygienic Prep</span>
          </div>

          <span className="text-stone-300 font-bold hidden xs:inline">·</span>

          <div className="hidden xs:flex items-center gap-1.5 text-xs font-semibold">
            <Heart className="w-4 h-4 text-[#7A1030] fill-[#7A1030]/20 shrink-0" />
            <span className="font-script text-sm text-[#7A1030]">Homemade with love</span>
          </div>
        </div>
      </div>
    </div>
  );
};
