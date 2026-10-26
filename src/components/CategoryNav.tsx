import React, { useRef } from 'react';
import { Star, Flame, UtensilsCrossed, Sandwich, CookingPot, Snowflake, Cookie } from 'lucide-react';
import { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryDetails = (catId: string) => {
    switch (catId) {
      case 'signature-kabab':
        return { label: 'Kabab', icon: <Flame className="w-5 h-5" /> };
      case 'rice-kitchen':
        return { label: 'Rice', icon: <UtensilsCrossed className="w-5 h-5" /> };
      case 'burger-crunch':
        return { label: 'Burgers', icon: <Sandwich className="w-5 h-5" /> };
      case 'desi-handi':
        return { label: 'Handi', icon: <CookingPot className="w-5 h-5" /> };
      case 'frozen-kitchen':
        return { label: 'Frozen', icon: <Snowflake className="w-5 h-5" /> };
      case 'snack-attack':
        return { label: 'Snacks', icon: <Cookie className="w-5 h-5" /> };
      default:
        return { label: 'Menu', icon: <UtensilsCrossed className="w-5 h-5" /> };
    }
  };

  const handleSelect = (id: string) => {
    onSelectCategory(id);
    if (id === 'featured') {
      const el = document.getElementById('section-popular');
      if (el) {
        const yOffset = -120;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else if (id !== 'all') {
      const el = document.getElementById(`cat-${id}`);
      if (el) {
        const yOffset = -120;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="py-2.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {/* 1. Featured Chip (Star) */}
          <button
            onClick={() => handleSelect('featured')}
            className={`shrink-0 flex flex-col items-center justify-center w-16 h-18 sm:w-20 sm:h-22 rounded-2xl p-2 transition-all duration-200 cursor-pointer shadow-xs ${
              activeCategory === 'featured'
                ? 'bg-[#7A1030] text-white shadow-md ring-2 ring-[#7A1030]/20'
                : 'bg-white hover:bg-[#FAF4E8] text-stone-700 border border-[#EBDCC8]'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                activeCategory === 'featured' ? 'text-[#C8A15A]' : 'text-[#7A1030]'
              }`}
            >
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold leading-none">
              Featured
            </span>
          </button>

          {/* Category Chips: Kabab, Rice, Burgers, Handi, Frozen, Snacks */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const details = getCategoryDetails(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`shrink-0 flex flex-col items-center justify-center w-16 h-18 sm:w-20 sm:h-22 rounded-2xl p-2 transition-all duration-200 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#7A1030] text-white shadow-md ring-2 ring-[#7A1030]/20'
                    : 'bg-white hover:bg-[#FAF4E8] text-stone-700 border border-[#EBDCC8]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                    isActive ? 'text-[#C8A15A]' : 'text-[#7A1030]'
                  }`}
                >
                  {details.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold leading-none truncate max-w-full">
                  {details.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
