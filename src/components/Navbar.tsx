import React from 'react';
import { CapsuleGlowEffect } from './CapsuleGlowEffect';

interface NavbarProps {
  onOpenInquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 pointer-events-auto select-none">
      <div className="relative inline-flex items-center justify-center group">
        {/* Subtle Brand Glow */}
        <div 
          className="absolute -inset-[10px] translate-y-[6px] rounded-full bg-[#3B82F6] opacity-25 blur-[25px] pointer-events-none -z-10" 
          aria-hidden="true"
        />
        
        <nav 
          className="glass-control-subtle relative z-10 flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#C9C2B4]/40 shadow-2xl transition-colors duration-300 overflow-hidden"
          aria-label="Primary Navigation"
        >
          {/* Internal Glow & Moving Edge Light */}
          <CapsuleGlowEffect />

          <a
            href="#work"
            className="relative z-10 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#8B8B8D] hover:text-[#F4F3EF] transition-colors duration-200"
          >
            WORK
          </a>
          
          <span className="relative z-10 text-[#3A3A40] text-[10px] sm:text-xs font-mono">•</span>
          
          <a
            href="#contact"
            className="relative z-10 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#8B8B8D] hover:text-[#F4F3EF] transition-colors duration-200"
          >
            CONTACT
          </a>
        </nav>
      </div>
    </div>
  );
};

