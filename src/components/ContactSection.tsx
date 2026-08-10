import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useMotionValue, animate, useAnimationFrame } from 'motion/react';
import { CapsuleGlowEffect } from './CapsuleGlowEffect';

interface ContactSectionProps {
  onOpenInquiry?: () => void;
}

const getEdgePathPoint = (
  t: number, 
  w: number, 
  h: number, 
  r: number, 
  inset: number,
  pathType: 'LB' | 'LT' | 'RT' | 'RB'
) => {
  const effW = w - inset * 2;
  const effH = h - inset * 2;
  const rEff = r - inset;
  
  const marbleRadius = 1.5;
  const startOffset = marbleRadius; 
  const endOffset = marbleRadius;

  const l1 = (effH / 2 - rEff) - startOffset;
  const l2 = (Math.PI * rEff) / 2;
  const l3 = (effW / 2 - rEff) - endOffset;
  const totalL = l1 + l2 + l3;
  
  const d = t * totalL;
  
  let x = 0, y = 0, angle = 0;
  
  if (pathType === 'LB') {
    if (d <= l1) {
      x = 0; y = effH / 2 + startOffset + d; angle = 90;
    } else if (d <= l1 + l2) {
      const arcD = d - l1;
      const theta = (arcD / l2) * (Math.PI / 2);
      x = rEff - rEff * Math.cos(theta);
      y = effH - rEff + rEff * Math.sin(theta);
      angle = 90 - theta * (180 / Math.PI);
    } else {
      const straightD = d - (l1 + l2);
      x = rEff + straightD; y = effH; angle = 0;
    }
  } else if (pathType === 'LT') {
    if (d <= l1) {
      x = 0; y = effH / 2 - startOffset - d; angle = -90;
    } else if (d <= l1 + l2) {
      const arcD = d - l1;
      const theta = (arcD / l2) * (Math.PI / 2);
      x = rEff - rEff * Math.cos(theta);
      y = rEff - rEff * Math.sin(theta);
      angle = -90 + theta * (180 / Math.PI);
    } else {
      const straightD = d - (l1 + l2);
      x = rEff + straightD; y = 0; angle = 0;
    }
  } else if (pathType === 'RT') {
    if (d <= l1) {
      x = effW; y = effH / 2 - startOffset - d; angle = -90;
    } else if (d <= l1 + l2) {
      const arcD = d - l1;
      const theta = (arcD / l2) * (Math.PI / 2);
      x = effW - rEff + rEff * Math.cos(theta);
      y = rEff - rEff * Math.sin(theta);
      angle = -90 - theta * (180 / Math.PI);
    } else {
      const straightD = d - (l1 + l2);
      x = effW - rEff - straightD; y = 0; angle = 180;
    }
  } else if (pathType === 'RB') {
    if (d <= l1) {
      x = effW; y = effH / 2 + startOffset + d; angle = 90;
    } else if (d <= l1 + l2) {
      const arcD = d - l1;
      const theta = (arcD / l2) * (Math.PI / 2);
      x = effW - rEff + rEff * Math.cos(theta);
      y = effH - rEff + rEff * Math.sin(theta);
      angle = 90 + theta * (180 / Math.PI);
    } else {
      const straightD = d - (l1 + l2);
      x = effW - rEff - straightD; y = effH; angle = 180;
    }
  }
  
  return { x: x + inset, y: y + inset, angle };
};

const PerimeterLightLoop: React.FC<{ isHovered?: boolean }> = ({ isHovered }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleLBRef = useRef<HTMLDivElement>(null);
  const particleLTRef = useRef<HTMLDivElement>(null);
  const particleRTRef = useRef<HTMLDivElement>(null);
  const particleRBRef = useRef<HTMLDivElement>(null);
  
  const progress = useMotionValue(0);
  const lightScale = useMotionValue(1);
  const colorProgress = useMotionValue(0);
  const isReversing = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let initialLoop = true;
    const run = async () => {
      while (isMounted) {
        if (!initialLoop) {
          animate(lightScale, [1, 1.2, 1], { duration: 0.15, ease: "easeInOut" });
          animate(colorProgress, 0, { duration: 0.15, ease: "easeInOut" });
        }
        initialLoop = false;
        
        isReversing.current = false;
        await animate(progress, 1, { duration: 2.5, ease: "easeInOut" });
        if (!isMounted) break;
        
        await Promise.all([
          animate(lightScale, [1, 1.2, 1], { duration: 0.15, ease: "easeInOut" }),
          animate(colorProgress, 1, { duration: 0.15, ease: "easeInOut" })
        ]);
        if (!isMounted) break;
        
        isReversing.current = true;
        await animate(progress, 0, { duration: 2.5, ease: "easeInOut" });
        if (!isMounted) break;
      }
    };
    run();
    
    return () => {
      isMounted = false;
    };
  }, [progress, lightScale, colorProgress]);

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const pLB = particleLBRef.current;
    const pLT = particleLTRef.current;
    const pRT = particleRTRef.current;
    const pRB = particleRBRef.current;
    if (!pLB || !pLT || !pRT || !pRB) return;
    
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const r = 32; 
    const inset = 1; 
    
    const pVal = progress.get();
    const sVal = lightScale.get();
    const cVal = colorProgress.get();
    
    const scaleX = isReversing.current ? -1 : 1;
    
    const ptLB = getEdgePathPoint(pVal, w, h, r, inset, 'LB');
    pLB.style.transform = `translate3d(${ptLB.x}px, ${ptLB.y}px, 0) rotate(${ptLB.angle}deg) scaleX(${scaleX}) scale(${sVal})`;
    
    const ptLT = getEdgePathPoint(pVal, w, h, r, inset, 'LT');
    pLT.style.transform = `translate3d(${ptLT.x}px, ${ptLT.y}px, 0) rotate(${ptLT.angle}deg) scaleX(${scaleX}) scale(${sVal})`;
    
    const ptRT = getEdgePathPoint(pVal, w, h, r, inset, 'RT');
    pRT.style.transform = `translate3d(${ptRT.x}px, ${ptRT.y}px, 0) rotate(${ptRT.angle}deg) scaleX(${scaleX}) scale(${sVal})`;
    
    const ptRB = getEdgePathPoint(pVal, w, h, r, inset, 'RB');
    pRB.style.transform = `translate3d(${ptRB.x}px, ${ptRB.y}px, 0) rotate(${ptRB.angle}deg) scaleX(${scaleX}) scale(${sVal})`;

    const setLayerOpacity = (el: HTMLDivElement, blueOp: number, purpleOp: number) => {
      const blueLayer = el.querySelector('.blue-layer') as HTMLDivElement;
      const purpleLayer = el.querySelector('.purple-layer') as HTMLDivElement;
      if (blueLayer) blueLayer.style.opacity = blueOp.toString();
      if (purpleLayer) purpleLayer.style.opacity = purpleOp.toString();
    };

    setLayerOpacity(pLT, cVal, 1 - cVal);
    setLayerOpacity(pLB, 1 - cVal, cVal);
    setLayerOpacity(pRT, 1 - cVal, cVal);
    setLayerOpacity(pRB, cVal, 1 - cVal);
  });

  const renderMarble = (ref: React.RefObject<HTMLDivElement>, id: string) => (
    <div 
      ref={ref} 
      className="absolute top-0 left-0"
      data-id={id}
    >
      <div className="absolute inset-0 blue-layer">
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 h-px bg-gradient-to-l from-blue-500 to-transparent transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.8 : 0.4 }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 transition-all duration-300"
          style={{ 
            width: isHovered ? "3px" : "2px",
            height: isHovered ? "3px" : "2px",
            boxShadow: isHovered 
              ? "0 0 16px 4px rgba(59,130,246,0.8), 0 0 4px 1px rgba(59,130,246,1)" 
              : "0 0 10px 2px rgba(59,130,246,0.6)",
          }}
        />
      </div>
      <div className="absolute inset-0 purple-layer">
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 h-px bg-gradient-to-l from-purple-500 to-transparent transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.8 : 0.4 }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 transition-all duration-300"
          style={{ 
            width: isHovered ? "3px" : "2px",
            height: isHovered ? "3px" : "2px",
            boxShadow: isHovered 
              ? "0 0 16px 4px rgba(168,85,247,0.8), 0 0 4px 1px rgba(168,85,247,1)" 
              : "0 0 10px 2px rgba(168,85,247,0.6)",
          }}
        />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10 rounded-[2rem] overflow-hidden">
      {renderMarble(particleLBRef, 'LB')}
      {renderMarble(particleLTRef, 'LT')}
      {renderMarble(particleRTRef, 'RT')}
      {renderMarble(particleRBRef, 'RB')}
    </div>
  );
};

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenInquiry }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <section id="contact" className="relative w-full flex flex-col gap-16 lg:gap-20 pt-8 lg:pt-12 pb-8 sm:pb-12 bg-[#000000]">
      <div className="w-full max-w-[1310px] mx-auto px-4 sm:px-8 lg:px-0">
        
        {/* Contact Glass Card Container */}
        <div 
          className="glass-card-medium relative w-full border border-[#232326] rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] p-8 sm:p-14 md:p-16 lg:py-20 flex flex-col items-center justify-center text-center overflow-hidden"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <PerimeterLightLoop isHovered={isCardHovered} />

          <h2 className="font-sans text-h2 font-medium text-[#F4F3EF] max-w-4xl mx-auto mb-8 sm:mb-10 relative z-10">
            Let's build something <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#E879F9] text-transparent bg-clip-text opacity-90">worth remembering.</span>
          </h2>

          {/* Email Button with Transferred Animated Tail */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative inline-flex items-center justify-center group">
              {/* Subtle Brand Glow */}
              <div 
                className="absolute -inset-[10px] translate-y-[6px] rounded-full bg-[#3B82F6] opacity-25 blur-[25px] pointer-events-none -z-20" 
                aria-hidden="true"
              />
              
              {/* Subtle Outer Soft Glow immediately around the capsule edge */}
              <div 
                className="absolute -inset-0.5 rounded-full blur-[4px] bg-[#C9C2B4]/20 opacity-50 pointer-events-none -z-10" 
                aria-hidden="true"
              />
              
              <a
                href="mailto:sajjadhossain811998@gmail.com"
                className="glass-control-subtle relative z-10 flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-[#C9C2B4]/40 hover:border-[#C9C2B4] text-[#F4F3EF] font-mono text-xs sm:text-sm tracking-[0.08em] transition-all duration-300 shadow-xl group-hover:scale-[1.02] cursor-pointer overflow-hidden"
              >
                {/* Internal Glow & Moving Edge Light (Transferred Tail) */}
                <CapsuleGlowEffect />

                <span className="relative z-10">sajjadhossain811998@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="site-container w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-micro text-[#8B8B8D]">
        <div className="flex items-center gap-2">
          <span>© 2026 The Imagination Studio. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F3EF] transition-colors flex items-center gap-1">
            <span>Instagram</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F3EF] transition-colors flex items-center gap-1">
            <span>Behance</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F3EF] transition-colors flex items-center gap-1">
            <span>Vimeo</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </section>
  );
};

