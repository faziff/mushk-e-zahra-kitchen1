import React, { useState, useEffect, useMemo } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { FestiveOfferBar, FestiveOfferCard } from './components/FestiveOfferBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustRow } from './components/TrustRow';
import { FoodCarousel } from './components/FoodCarousel';
import { CategoryNav } from './components/CategoryNav';
import { DesktopCategorySidebar } from './components/DesktopCategorySidebar';
import { DesktopCartPanel } from './components/DesktopCartPanel';
import { FoodCard } from './components/FoodCard';
import { PromoStrip } from './components/PromoStrip';
import { BottomNavBar } from './components/BottomNavBar';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { MenuCardModal } from './components/MenuCardModal';
import { AccountModal } from './components/AccountModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Category, MenuItem, StoreConfig } from './types';
import { ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

function KitchenApp() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    brandName: 'Mushk e Zahra Kitchen',
    tagline: 'Good food, happy hearts',
    minimumOrderAmount: 0,
    whatsappProvider: 'callmebot',
    offerEnabled: true,
    offerText: 'Festive Special: Free Fresh Fries box on orders above Rs. 1,500!',
    offerMinAmount: 1500,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { setIsCartOpen, setIsMenuCardModalOpen } = useCart();

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setStoreConfig((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchConfig();
  }, []);

  // Filter items based on activeCategory and searchQuery
  const filteredItems = useMemo(() => {
    let result = items;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, searchQuery]);

  // Popular Picks items (featured items or bestsellers)
  const popularPicks = useMemo(() => {
    return items.filter((item) => item.featured || item.badge).slice(0, 6);
  }, [items]);

  // Chef's Specials for Horizontal Carousel
  const chefSpecials = useMemo(() => {
    const specialIds = [
      'chicken-pistasal-biryani',
      'shami-kabab',
      'beef-anda-shami-burger',
      'malai-boti-samosa',
      'anday-keelay',
      'fresh-fries',
      'chicken-macaroni-half',
      'chapli-kabab',
    ];
    return items.filter((item) => specialIds.includes(item.id));
  }, [items]);

  // Group items by category for full menu display
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>();

    categories.forEach((cat) => {
      map.set(cat.id, []);
    });

    items.forEach((item) => {
      const list = map.get(item.category);
      if (list) {
        list.push(item);
      } else {
        map.set(item.category, [item]);
      }
    });

    return map;
  }, [categories, items]);

  // Desktop Scroll-spy to automatically update activeCategory
  useEffect(() => {
    const handleScroll = () => {
      if (searchQuery.trim()) return;

      const sectionPopular = document.getElementById('section-popular');
      if (sectionPopular) {
        const rect = sectionPopular.getBoundingClientRect();
        if (rect.top <= 180 && rect.bottom >= 100) {
          setActiveCategory('popular');
          return;
        }
      }

      for (const cat of categories) {
        const el = document.getElementById(`cat-${cat.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3E4] text-[#2D2424] antialiased selection:bg-[#7A1030] selection:text-white">
      {/* 1. Festive Offer Strip at Top */}
      {storeConfig.offerEnabled !== false && (
        <FestiveOfferBar
          offerText={storeConfig.offerText}
          offerMinAmount={storeConfig.offerMinAmount}
        />
      )}

      {/* 2. Top Bar: Logo on left, round cream buttons on right + pill search bar */}
      <Header
        onOpenAccount={() => setIsAccountOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner (24px rounded maroon card with headline & carousel) */}
      <Hero />

      {/* Trust Row under Hero */}
      <TrustRow />

      {/* Horizontal Food Carousel: Chef's Handpicked Specials */}
      {!searchQuery.trim() && chefSpecials.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-1">
          <FoodCarousel
            title="Today's Fresh Specials"
            subtitle="Handcrafted daily with authentic royal spices and pure love"
            items={chefSpecials}
          />
        </div>
      )}

      {/* Mobile/Tablet Horizontal Category Chips */}
      <div className="lg:hidden">
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            setActiveCategory(id);
            setSearchQuery('');
          }}
        />
      </div>

      {/* Main Container: Desktop 3-Panel Layout (Left Sidebar | Center Menu | Right Cart) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 pb-20 md:pb-12">
        <div className="flex items-start gap-6">
          {/* LEFT: Desktop Sticky Category Sidebar */}
          <DesktopCategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={(id) => {
              setActiveCategory(id);
              setSearchQuery('');
            }}
          />

          {/* CENTER: Menu Products Main Content Area */}
          <main id="menu-section" className="flex-1 min-w-0 space-y-8">
            {isLoading ? (
              /* Loading Skeletons: 2 columns on mobile, 3 on tablet/desktop */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-[20px] p-3 border border-[#EBDCC8] space-y-3">
                    <div className="w-full aspect-square bg-stone-200 rounded-2xl" />
                    <div className="h-3.5 bg-stone-200 rounded-md w-3/4" />
                    <div className="h-3 bg-stone-200 rounded-md w-1/2" />
                    <div className="h-6 bg-stone-200 rounded-full w-full mt-2" />
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              /* Search Results: 2 columns on mobile, 3 on tablet/desktop */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sans font-bold text-base sm:text-lg text-stone-900">
                    Search Results for "{searchQuery}" ({filteredItems.length})
                  </h2>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-[#7A1030] hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-[#EBDCC8] p-6 max-w-md mx-auto shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-[#7A1030]/10 text-[#7A1030] flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans font-bold text-base text-stone-800">
                      No matching dishes
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Try searching for biryani, shami, samosa, or kabab.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {filteredItems.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Standard Full Menu Display */
              <>
                {/* 1. Popular Picks Section (2 columns on mobile, 3 on tablet/desktop) */}
                <section id="section-popular" className="scroll-mt-28">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <h2 className="font-sans font-bold text-base sm:text-xl text-stone-900 tracking-tight flex items-center gap-2">
                        <span>Popular Picks</span>
                        <Sparkles className="w-4 h-4 text-[#C8A15A]" />
                      </h2>
                      <p className="text-[11px] sm:text-xs text-stone-500">
                        Top recommended homemade favorites
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const el = document.getElementById('cat-signature-kabab');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-[#7A1030] hover:text-[#580B22] transition-colors cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 2 COLUMNS ON MOBILE */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {popularPicks.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                {/* 2. Festive Combo Offer Banner Card */}
                {storeConfig.offerEnabled !== false && (
                  <FestiveOfferCard
                    onOrderNow={() => setIsCartOpen(true)}
                    offerMinAmount={storeConfig.offerMinAmount}
                  />
                )}

                {/* 3. Every Menu Category in its own 2-column section */}
                {categories.map((cat) => {
                  const catItems = itemsByCategory.get(cat.id) || [];
                  if (catItems.length === 0) return null;

                  return (
                    <section
                      key={cat.id}
                      id={`cat-${cat.id}`}
                      className="pt-4 scroll-mt-28 border-t border-[#EBDCC8]/60"
                    >
                      <div className="flex items-baseline justify-between mb-3 pb-1">
                        <div>
                          <h2 className="font-sans font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                            {cat.name}
                          </h2>
                          <p className="text-[11px] text-stone-500">
                            {cat.tagline}
                          </p>
                        </div>
                        {cat.note && (
                          <span className="text-[10px] uppercase font-bold text-[#7A1030] tracking-wider bg-white px-2 py-0.5 rounded-md border border-[#EBDCC8] shadow-2xs">
                            {cat.note}
                          </span>
                        )}
                      </div>

                      {/* 2 COLUMNS ON MOBILE, 3 ON TABLET/DESKTOP */}
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {catItems.map((item) => (
                          <FoodCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  );
                })}

                {/* Promo Strip near the bottom */}
                <PromoStrip onOrderNow={() => setIsCartOpen(true)} />
              </>
            )}
          </main>

          {/* RIGHT: Desktop Sticky Cart Panel */}
          <DesktopCartPanel offerMinAmount={storeConfig.offerMinAmount} />
        </div>
      </div>

      {/* Floating Bottom Navigation Bar (Mobile only, hidden on desktop) */}
      <BottomNavBar onOpenAccount={() => setIsAccountOpen(true)} />

      {/* Modals & Overlays */}
      <CartDrawer
        minimumOrder={storeConfig.minimumOrderAmount}
        offerMinAmount={storeConfig.offerMinAmount}
      />
      <ItemDetailModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <MenuCardModal />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenKitchenStaff={() => setIsAdminOpen(true)}
      />
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onMenuUpdated={fetchMenu}
      />

      {/* Footer with Reference Logo and WhatsApp Contact */}
      <Footer
        onOpenMenuCard={() => setIsMenuCardModalOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <KitchenApp />
    </CartProvider>
  );
}
