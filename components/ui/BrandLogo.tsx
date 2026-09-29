'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'monogram';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const sizeMap = {
    sm: { width: 130, height: 42, className: 'h-8 sm:h-9 w-auto' },
    md: { width: 170, height: 56, className: 'h-11 sm:h-12 w-auto' },
    lg: { width: 230, height: 75, className: 'h-14 sm:h-16 w-auto' },
    xl: { width: 320, height: 105, className: 'h-20 sm:h-24 w-auto' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'monogram') {
    return (
      <div className={`flex items-center gap-1.5 font-mono font-black tracking-tighter ${className}`}>
        <span className="text-[#3FA85B] text-2xl font-black tracking-tight">3</span>
        <span className="inline-block w-4 h-4 rounded-full border-2 border-[#3FA85B] animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/logo.png"
        alt="3 ZERO Campus Club ISIMS"
        width={currentSize.width}
        height={currentSize.height}
        className={`object-contain ${currentSize.className}`}
        priority
      />
    </div>
  );
};
