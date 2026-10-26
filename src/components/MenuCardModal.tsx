import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MenuCardModal: React.FC = () => {
  const { isMenuCardModalOpen, setIsMenuCardModalOpen } = useCart();
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isMenuCardModalOpen) return null;

  const menuCardPath = '/assets/aistudio/2527300a-e748-4b18-8f9e-015e2178d4fa_bf365d12.jfif';

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, z - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setIsMenuCardModalOpen(false)}
      />

      <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[95vh] flex flex-col border border-stone-700 animate-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="p-4 bg-[#7A1030] text-white flex items-center justify-between border-b border-[#941B3E]">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white">
              Original Printed Menu Card
            </h3>
            <p className="text-xs text-stone-200">
              Mushk e Zahra Kitchen — Official Price & Items Guide
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <a
              href={menuCardPath}
              target="_blank"
              rel="noopener noreferrer"
              download="Mushk_e_Zahra_Menu.jfif"
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              title="Download Card"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsMenuCardModalOpen(false)}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display Area with Pan/Zoom */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-stone-950/90 select-none">
          <div
            className="transition-transform duration-200 origin-center max-w-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={menuCardPath}
              alt="Mushk e Zahra Kitchen Original Menu Card"
              className="max-h-[75vh] w-auto rounded-xl shadow-2xl object-contain mx-auto"
            />
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-stone-900 border-t border-stone-800 text-center text-xs text-stone-400">
          Showing authentic kitchen menu reference · All items can be ordered directly through this site.
        </div>
      </div>
    </div>
  );
};
