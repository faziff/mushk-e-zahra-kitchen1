import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  isCircleOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  isCircleOnly = false,
}) => {
  const logoSrc = '/assets/aistudio/858126179_1845911380094833_4645920199700401382_n_4eb8b49a.jpg';

  const iconDimensions = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-13 sm:h-13',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  if (isCircleOnly) {
    return (
      <div className={`relative rounded-full overflow-hidden shadow-sm border border-[#EBDCC8] shrink-0 ${iconDimensions} ${className}`}>
        <img
          src={logoSrc}
          alt="Mushk e Zahra Kitchen Logo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Reference Logo Emblem */}
      <div className={`relative rounded-full overflow-hidden shadow-sm border-2 border-[#C8A15A]/60 shrink-0 bg-[#FBF3E4] ${iconDimensions}`}>
        <img
          src={logoSrc}
          alt="Mushk e Zahra Kitchen Logo"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight select-none">
        <div className="flex items-baseline">
          <span className={`font-serif font-bold text-[#7A1030] tracking-tight ${titleSizes}`}>
            Mushk <span className="font-script text-[#C8A15A] text-[1.18em] lowercase font-normal mx-0.5">e</span> Zahra
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 -mt-0.5">
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] font-bold text-[#7A1030] uppercase">
              K I T C H E N
            </span>
            <span className="text-[10px] text-stone-500 font-script hidden xs:inline">
              · Good Food ♥ Happy Hearts
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
