import React, { useId } from 'react';

interface CapsuleGlowEffectProps {
  glowColor?: string;
}

export const CapsuleGlowEffect: React.FC<CapsuleGlowEffectProps> = () => {
  const gradientId = useId();
  const filterId = useId();

  return (
    <>
      {/* 1. SUBTLE DYNAMIC INTERNAL GLOW - Low opacity (~5-10%) so transparent glass remains dominant */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden -z-10"
        aria-hidden="true"
      >
        {/* Breathing inner glass reflection highlight */}
        <div 
          className="absolute inset-0 rounded-full capsule-internal-shine pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(244, 243, 239, 0.15) 0%, transparent 80%)'
          }}
        />
      </div>

      {/* 2. MOVING EDGE LIGHT - Tail visual rendering constrained to exact capsule perimeter path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible rounded-full -z-5">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#A855F7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
          </linearGradient>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="9999"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          pathLength="100"
          filter={`url(#${filterId})`}
          className="animated-capsule-edge-light"
        />
      </svg>
    </>
  );
};


