import React from 'react';
import { cn } from '@/lib/utils';
import logoDark from '@/assets/mittamuoto-logo-dark.png';
import logoLight from '@/assets/mittamuoto-logo-light.png';

interface MSSlideLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'title' | 'dark';
  className?: string;
}

export function MSSlideLayout({ children, variant = 'default', className }: MSSlideLayoutProps) {
  const isDark = variant === 'dark' || variant === 'title';
  
  return (
    <div 
      className={cn(
        'w-full h-full relative font-sans slide-content',
        isDark 
          ? 'bg-slide-primary text-white' 
          : 'bg-[#FCFBF8] text-slide-gray-900',
        className
      )}
    >
      {/* Logo - Top Right */}
      <div className="absolute top-8 right-10 z-10">
        <img 
          src={isDark ? logoLight : logoDark} 
          alt="Mittamuoto" 
          className="h-8 w-auto"
        />
      </div>
      
      {/* Content */}
      <div className="w-full h-full">
        {children}
      </div>
      
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slide-accent" />
    </div>
  );
}

// Legacy exports
export function LogoMark() { return null; }
export const MSLogo = LogoMark;
