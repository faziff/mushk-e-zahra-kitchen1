import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Phone, MessageCircle, FileText, User, Sparkles, Utensils, Heart } from 'lucide-react';

interface FooterProps {
  onOpenMenuCard: () => void;
  onOpenAccount: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMenuCard,
  onOpenAccount,
}) => {
  const whatsappNumber = '+92 321 0009239';
  const whatsappLink = 'https://wa.me/923210009239';

  return (
    <footer className="relative bg-[#7A1030] text-[#FBF3E4] pt-12 pb-24 md:pb-12 overflow-hidden border-t-2 border-[#C8A15A]">
      {/* Decorative floral background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#C8A15A" className="w-full h-full">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <BrandLogo size="lg" showTagline={true} />
            </div>

            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed max-w-sm mx-auto md:mx-0">
              Authentic homemade Pakistani delicacies crafted fresh daily with royal love, 100% Halal chicken, pure ghee, and slow-simmered spices. Good food, happy hearts!
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#C8A15A] font-semibold">
              <span>Fresh</span>
              <span>·</span>
              <span>Tasty</span>
              <span>·</span>
              <span>Healthy</span>
              <span>·</span>
              <span className="font-script text-sm text-[#FAF4E8]">Homemade with love ♡</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3 text-center md:text-left">
            <h4 className="font-serif font-bold text-sm text-[#C8A15A] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-200">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('menu-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>Full Kitchen Menu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('section-popular');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>Popular Picks</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMenuCard}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>View Original Menu Card</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAccount}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>Customer Account & Saved Details</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & WhatsApp Order Option */}
          <div className="md:col-span-4 space-y-3 text-center md:text-left">
            <h4 className="font-serif font-bold text-sm text-[#C8A15A] uppercase tracking-wider">
              Order Inquiries & Support
            </h4>
            <p className="text-xs text-stone-200">
              Need assistance with catering, custom orders, or party platters? Contact our kitchen directly:
            </p>

            <div className="pt-1 flex flex-col items-center md:items-start gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: {whatsappNumber}</span>
              </a>

              <span className="text-[11px] text-stone-300">
                Direct WhatsApp contact for customer inquiries
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Reassurance */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Mushk e Zahra Kitchen. All rights reserved.
          </div>

          <div className="flex items-center gap-1.5 text-stone-300 font-medium">
            <span>Freshly cooked to order</span>
            <span>·</span>
            <span>Estimated delivery 3-4 hours</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
