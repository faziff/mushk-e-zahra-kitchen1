import React from 'react';
import { Home, Utensils, ShoppingBag, FileText, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface BottomNavBarProps {
  onOpenAccount: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenAccount }) => {
  const { totalCount, setIsCartOpen, setIsMenuCardModalOpen } = useCart();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuClick = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden max-w-sm mx-auto">
      <nav
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-[#EBDCC8]/80 px-4 py-2 flex items-center justify-between"
        aria-label="Mobile Navigation"
      >
        {/* 1. Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center text-stone-500 hover:text-[#7A1030] transition-colors py-1 px-2 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* 2. Menu */}
        <button
          onClick={handleMenuClick}
          className="flex flex-col items-center justify-center text-stone-500 hover:text-[#7A1030] transition-colors py-1 px-2 cursor-pointer"
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Menu</span>
        </button>

        {/* 3. Raised Center Maroon Cart Button */}
        <div className="relative -mt-7 flex flex-col items-center">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-14 h-14 rounded-full bg-[#7A1030] hover:bg-[#600C25] text-white flex items-center justify-center shadow-lg border-4 border-[#FBF3E4] transition-transform active:scale-90 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-6 h-6 text-white" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8A15A] text-[#3E2300] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                {totalCount}
              </span>
            )}
          </button>
          <span className="text-[10px] font-bold text-[#7A1030] mt-0.5">Cart</span>
        </div>

        {/* 4. Info / Menu Card */}
        <button
          onClick={() => setIsMenuCardModalOpen(true)}
          className="flex flex-col items-center justify-center text-stone-500 hover:text-[#7A1030] transition-colors py-1 px-2 cursor-pointer"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Card</span>
        </button>

        {/* 5. Account (Replaced Admin) */}
        <button
          onClick={onOpenAccount}
          className="flex flex-col items-center justify-center text-stone-500 hover:text-[#7A1030] transition-colors py-1 px-2 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Account</span>
        </button>
      </nav>
    </div>
  );
};
