import React from 'react';
import { ShoppingBag, Search, FileText, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onOpenAccount: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAccount,
  searchQuery,
  setSearchQuery,
}) => {
  const { totalCount, setIsCartOpen, setIsMenuCardModalOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#FBF3E4]/95 backdrop-blur-md pt-3 pb-3 border-b border-[#EBDCC8]/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top row: Logo on left, round cream buttons on right */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo with reference emblem and tagline */}
          <BrandLogo size="md" showTagline={true} />

          {/* Round cream buttons with soft shadow */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Original Menu Card Button */}
            <button
              onClick={() => setIsMenuCardModalOpen(true)}
              className="w-10 h-10 rounded-full bg-white text-stone-700 hover:text-[#7A1030] hover:bg-[#FAF4E8] flex items-center justify-center shadow-xs border border-[#E8DAC6] transition-all active:scale-95 cursor-pointer"
              title="View Original Menu Card"
              aria-label="View Original Menu Card"
            >
              <FileText className="w-4 h-4 text-[#C8A15A]" />
            </button>

            {/* Account Button (Replaces Admin Access for regular customers) */}
            <button
              onClick={onOpenAccount}
              className="w-10 h-10 rounded-full bg-white text-stone-700 hover:text-[#7A1030] hover:bg-[#FAF4E8] flex items-center justify-center shadow-xs border border-[#E8DAC6] transition-all active:scale-95 cursor-pointer"
              title="Customer Account & Order History"
              aria-label="Customer Account"
            >
              <User className="w-4 h-4 text-[#7A1030]" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full bg-white text-[#7A1030] hover:bg-[#FAF4E8] flex items-center justify-center shadow-xs border border-[#E8DAC6] transition-all active:scale-95 cursor-pointer"
              title="View Cart"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A1030] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar: Rounded pill, soft shadow, search icon, live filtering */}
        <div className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search biryani, kabab, burger, handi, samosa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-white rounded-full text-base sm:text-sm text-[#2D2424] placeholder:text-stone-400 shadow-xs border border-[#E8DAC6] focus:outline-none focus:ring-2 focus:ring-[#7A1030]/20 focus:border-[#7A1030] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-xs text-stone-400 hover:text-stone-600 bg-stone-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
