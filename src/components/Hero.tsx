import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSlide {
  headline: string;
  subtext: string;
  tag: string;
  dishName: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    headline: 'HOMEMADE. FRESH. PERFECT.',
    subtext: 'Big flavor. Bold choices.',
    tag: 'Signature Biryani',
    dishName: 'Chicken PistasaI Biryani',
    image: '/assets/food/chicken-pistasal-biryani.jpg',
  },
  {
    headline: 'SIZZLING. SPICED. JUICY.',
    subtext: 'Handcrafted Shami & Seekh Kababs.',
    tag: 'Signature Kabab',
    dishName: 'Peshawari & Shami Kababs',
    image: '/assets/food/shami-kabab.jpg',
  },
  {
    headline: 'CRUNCHY. CRISP. GOLDEN.',
    subtext: 'Fresh samosas & ready-to-cook snacks.',
    tag: 'Snack Attack',
    dishName: 'Malai Boti & Chicken Samosas',
    image: '/assets/food/malai-boti-samosa.jpg',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="pt-2 pb-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Hero Card with 24px radius and maroon gradient */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#7A1030] via-[#630B24] to-[#450719] text-white shadow-lg p-5 sm:p-8 min-h-[200px] sm:min-h-[260px] flex items-center justify-between transition-all duration-500">
          {/* Subtle textured radial highlight */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-b from-[#C8A15A]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Left Content */}
          <div className="relative z-10 max-w-[62%] sm:max-w-md space-y-2 sm:space-y-3">
            {/* Bold condensed display headline */}
            <h1 className="font-condensed font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] uppercase text-white drop-shadow-xs">
              {slide.headline}
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-base text-stone-200/90 font-normal leading-snug">
              {slide.subtext}
            </p>

            {/* White pill button: Order Now → */}
            <div className="pt-1.5 sm:pt-2">
              <button
                onClick={scrollToMenu}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-[#7A1030] hover:bg-[#FAF4E8] rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7A1030]" />
              </button>
            </div>
          </div>

          {/* Right Content: Large Appetizing Food Photo */}
          <div className="relative z-10 w-[38%] sm:w-[45%] md:w-[40%] flex justify-end items-center">
            <div className="relative w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src={slide.image}
                alt={slide.dishName}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-5 bg-[#7A1030]' : 'w-1.5 bg-[#D7C4AF]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
