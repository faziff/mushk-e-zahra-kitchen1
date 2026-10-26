import React from 'react';
import { Star, Flame, UtensilsCrossed, Sandwich, CookingPot, Snowflake, Cookie } from 'lucide-react';
import { Category } from '../types';

interface DesktopCategorySidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const DesktopCategorySidebar: React.FC<DesktopCategorySidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'signature-kabab':
        return <Flame className="w-4 h-4" />;
      case 'rice-kitchen':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'burger-crunch':
        return <Sandwich className="w-4 h-4" />;
      case 'desi-handi':
        return <CookingPot className="w-4 h-4" />;
      case 'frozen-kitchen':
        return <Snowflake className="w-4 h-4" />;
      case 'snack-attack':
        return <Cookie className="w-4 h-4" />;
      default:
        return <UtensilsCrossed className="w-4 h-4" />;
    }
  };

  const handleClick = (id: string) => {
    onSelectCategory(id);
    if (id === 'popular') {
      const el = document.getElementById('section-popular');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(`cat-${id}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24 bg-white rounded-3xl p-3.5 border border-[#EBDCC8] shadow-sm space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
          Categories
        </div>

        {/* Popular Picks */}
        <button
          onClick={() => handleClick('popular')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'popular'
              ? 'bg-[#7A1030] text-white shadow-xs'
              : 'text-stone-700 hover:bg-[#FAF4E8] hover:text-[#7A1030]'
          }`}
        >
          <span className={activeCategory === 'popular' ? 'text-[#C8A15A]' : 'text-[#7A1030]'}>
            <Star className="w-4 h-4 fill-current" />
          </span>
          <span>Popular Picks</span>
        </button>

        {/* Category List */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7A1030] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-[#FAF4E8] hover:text-[#7A1030]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className={isActive ? 'text-[#C8A15A]' : 'text-[#7A1030]'}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span className="truncate">{cat.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
