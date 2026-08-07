import React, { useEffect, useState } from 'react';

export function FrostedGlassCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${
          isHovered ? 1.4 : 1
        })`,
      }}
    >
      {/* Frosted Glass Cursor Lens matching New Reference Asset */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden backdrop-blur-md bg-white/[0.12] border border-white/50 shadow-[0_8px_20px_rgba(0,0,0,0.4),0_0_12px_rgba(255,255,255,0.25)] flex items-center justify-center">
        {/* Soft Ambient Refraction Glow (Brand Palette: #EF7722, #FF8A3D, #FFC18A) */}
        <div 
          className="absolute inset-0 opacity-50 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(239, 119, 34, 0.7) 0%, rgba(255, 138, 61, 0.6) 70%, transparent 100%)',
          }}
        />
        {/* Fine Grain Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Core Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm relative z-10" />
      </div>
    </div>
  );
}
