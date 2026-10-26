import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`w-full h-full bg-[#FAF4E8] flex flex-col items-center justify-center p-3 text-center border border-[#EBDCC8] ${className}`}>
        {/* Soft maroon/cream placeholder with chef-hat icon */}
        <div className="w-10 h-10 rounded-full bg-[#7A1030]/10 flex items-center justify-center text-[#7A1030] mb-1">
          <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
            <path
              d="M 28 66 C 18 66 12 58 12 48 C 12 37 20 32 26 31 C 24 20 35 12 48 12 C 60 12 72 18 73 30 C 79 31 88 36 88 47 C 88 58 81 66 71 66 Z"
              fill="#7A1030"
            />
            <rect x="22" y="68" width="56" height="10" rx="3" fill="#7A1030" />
            <path
              d="M 50 48 C 48 42 41 40 37 45 C 32 50 38 57 50 63 C 62 57 68 50 63 45 C 59 40 52 42 50 48 Z"
              fill="#FAF4E8"
            />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-[#7A1030] uppercase tracking-wider line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-100">
      {/* Skeleton shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
};
