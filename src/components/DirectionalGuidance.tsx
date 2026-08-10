import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDown,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  MoveHorizontal,
  Sparkles,
} from 'lucide-react';

type IconType = 'down' | 'up' | 'left' | 'right' | 'horizontal' | 'sparkles';

interface GuidanceState {
  label: string;
  iconType: IconType;
}

export const DirectionalGuidance: React.FC = () => {
  const [guidance, setGuidance] = useState<GuidanceState>({
    label: 'SCROLL DOWN',
    iconType: 'down',
  });

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      if (currentY <= 50) {
        setGuidance({ label: 'SCROLL DOWN', iconType: 'down' });
      } else if (currentY >= maxScroll - 50) {
        setGuidance({ label: 'SCROLL UP', iconType: 'up' });
      } else if (Math.abs(delta) > 1) {
        if (delta > 0) {
          setGuidance({ label: 'SCROLL DOWN', iconType: 'down' });
        } else {
          setGuidance({ label: 'SCROLL UP', iconType: 'up' });
        }
      }
      
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial evaluation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderIcon = (type: IconType) => {
    const iconStyle = { stroke: 'url(#directionalBrandGradient)' };
    const iconClass = "w-3.5 h-3.5";

    const getAnimationProps = () => {
      switch (type) {
        case 'up': return { y: [0, -3, 0] };
        case 'left': return { x: [0, -3, 0] };
        case 'right': return { x: [0, 3, 0] };
        case 'horizontal': return { x: [-2, 2, -2] };
        case 'sparkles': return { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] };
        case 'down':
        default: return { y: [0, 3, 0] };
      }
    };

    let iconElement;
    switch (type) {
      case 'up': iconElement = <ArrowUp className={iconClass} style={iconStyle} />; break;
      case 'left': iconElement = <ArrowLeft className={iconClass} style={iconStyle} />; break;
      case 'right': iconElement = <ArrowRight className={iconClass} style={iconStyle} />; break;
      case 'horizontal': iconElement = <MoveHorizontal className={iconClass} style={iconStyle} />; break;
      case 'sparkles': iconElement = <Sparkles className={iconClass} style={iconStyle} />; break;
      case 'down':
      default: iconElement = <ArrowDown className={iconClass} style={iconStyle} />; break;
    }

    return (
      <motion.div
        animate={getAnimationProps()}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
        className="flex items-center justify-center"
      >
        {iconElement}
      </motion.div>
    );
  };

  return (
    <aside
      className="fixed right-2 sm:right-7 lg:right-9 top-1/2 -translate-y-1/2 z-40 pointer-events-none flex flex-col items-center gap-2.5 sm:gap-4 select-none scale-90 sm:scale-100 origin-right"
      aria-label="Directional Navigation Guidance"
    >
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="directionalBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#E879F9" />
          </linearGradient>
        </defs>
      </svg>

      {/* Icon Badge Container */}
      <div className="relative flex items-center justify-center group">
        {/* Subtle Brand Glow Underneath */}
        <div 
          className="absolute -inset-[10px] translate-y-[5px] rounded-full bg-[#3B82F6] opacity-20 blur-[22px] pointer-events-none -z-10" 
          aria-hidden="true"
        />

        {/* Icon Badge */}
        <div className="glass-control-subtle relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9C2B4]/40 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={guidance.iconType + guidance.label}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              {renderIcon(guidance.iconType)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Very Thin Vertical Line */}
      <div className="w-[1px] h-10 sm:h-14 bg-gradient-to-b from-[#232326] via-[#C9C2B4]/30 to-[#232326] transition-all duration-500" />

      {/* Directional Text Label */}
      <div className="h-28 sm:h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={guidance.label}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#8B8B8D] whitespace-nowrap [writing-mode:vertical-rl] rotate-180"
          >
            {guidance.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </aside>
  );
};
