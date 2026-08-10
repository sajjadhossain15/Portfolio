import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, useAnimation, useTransform, animate, useInView } from 'motion/react';
import { PRINCIPLES } from '../data/studioData';

const OUTSIDE_SPAWNS = [
  { x: -50, y: -50 },
  { x: 150, y: -50 },
  { x: -50, y: 150 },
  { x: 150, y: 150 },
  { x: -50, y: 50 },
  { x: 150, y: 50 },
  { x: 50, y: -50 },
  { x: 50, y: 150 },
];

const TARGETS = [
  { index: 0, x: 50, y: 15 },
  { index: 1, x: 25, y: 35 },
  { index: 2, x: 75, y: 35 },
  { index: 3, x: 25, y: 65 },
  { index: 4, x: 75, y: 65 },
  { index: 5, x: 50, y: 85 },
];

const TEXT_POSITIONS = [
  { x: 50, y: 15 },
  { x: 25, y: 35 },
  { x: 75, y: 35 },
  { x: 25, y: 65 },
  { x: 75, y: 65 },
  { x: 50, y: 85 },
];

const EnergyParticle: React.FC<{
  id: number;
  isActive: boolean;
  onImpact: (idx: number, isPermanent: boolean) => void;
  isPermanent: boolean;
  onTriggerChange?: (idx: number, isEntering: boolean) => void;
}> = ({ id, isActive, onImpact, isPermanent, onTriggerChange }) => {
  const progress = useMotionValue(0);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rotation = useMotionValue(0);
  const opacity = useMotionValue(0);

  const pathRef = useRef({ startX: 0, startY: 0, ctrlX: 0, ctrlY: 0, endX: 0, endY: 0 });
  const isActiveRef = useRef(isActive);
  const currentInsideRef = useRef<number>(-1);
  const targetPoolRef = useRef<number[]>([]);
  const recentTargetsRef = useRef<number[]>([]);
  
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    let isMounted = true;
    let isWaitingForActive = true;
    let currentTargetIndex = -1;

    const getNextTarget = () => {
      if (targetPoolRef.current.length === 0) {
        const newPool = [0, 1, 2, 3, 4, 5];
        for (let i = newPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newPool[i], newPool[j]] = [newPool[j], newPool[i]];
        }
        if (recentTargetsRef.current.length > 0 && newPool[0] === recentTargetsRef.current[recentTargetsRef.current.length - 1]) {
          [newPool[0], newPool[1]] = [newPool[1], newPool[0]];
        }
        targetPoolRef.current = newPool;
      }
      return targetPoolRef.current.shift()!;
    };

    const runLoop = async () => {
      while (isMounted) {
        if (isWaitingForActive) {
          if (!isActiveRef.current) {
            await new Promise(r => setTimeout(r, 200));
            continue;
          }
          isWaitingForActive = false;
          
          const spawn = OUTSIDE_SPAWNS[Math.floor(Math.random() * OUTSIDE_SPAWNS.length)];
          x.set(spawn.x);
          y.set(spawn.y);
          opacity.set(0);
          
          // Stagger the spawns based on ID
          await new Promise(r => setTimeout(r, 100 + id * 250));
          if (!isMounted) break;

          // Phase 1: Move from outside to the CENTER of the composition
          let startX = x.get();
          let startY = y.get();
          let centerEndX = 50 + (Math.random() * 20 - 10);
          let centerEndY = 50 + (Math.random() * 20 - 10);
          
          let cCtrlX = (startX + centerEndX) / 2 + (Math.random() * 40 - 20);
          let cCtrlY = (startY + centerEndY) / 2 + (Math.random() * 40 - 20);
          
          pathRef.current = { startX, startY, ctrlX: cCtrlX, ctrlY: cCtrlY, endX: centerEndX, endY: centerEndY };
          progress.set(0);
          
          animate(opacity, 1, { duration: 0.5 });
          const centerDuration = 1.0 + Math.random() * 0.5;
          await animate(progress, 1, { duration: centerDuration, ease: "easeInOut" });
          
          if (!isMounted) break;
          
          if (!isPermanent) {
            // Transient tails exit immediately after converging at the center visually
            const exit = OUTSIDE_SPAWNS[Math.floor(Math.random() * OUTSIDE_SPAWNS.length)];
            const eStartX = x.get();
            const eStartY = y.get();
            let eCtrlX = (eStartX + exit.x) / 2 + (Math.random() * 40 - 20);
            let eCtrlY = (eStartY + exit.y) / 2 + (Math.random() * 40 - 20);
            
            pathRef.current = { startX: eStartX, startY: eStartY, ctrlX: eCtrlX, ctrlY: eCtrlY, endX: exit.x, endY: exit.y };
            progress.set(0);
            
            const exitDuration = 1.5 + Math.random() * 0.5;
            await animate(progress, 1, { duration: exitDuration, ease: "easeInOut" });
            
            if (isMounted) {
              opacity.set(0);
            }
            
            isWaitingForActive = true;
            continue;
          }

          currentTargetIndex = getNextTarget();
          recentTargetsRef.current = [];
        }

        if (!isMounted) break;

        const target = TARGETS.find(t => t.index === currentTargetIndex)!;
        const startX = x.get();
        const startY = y.get();
        
        const midX = (startX + target.x) / 2;
        const midY = (startY + target.y) / 2;
        
        let ctrlX = midX + (Math.random() * 40 - 20);
        let ctrlY = midY + (Math.random() * 40 - 20);
        
        pathRef.current = { startX, startY, ctrlX, ctrlY, endX: target.x, endY: target.y };
        progress.set(0);
        
        const duration = 1.2 + Math.random() * 0.6;
        
        let hasTriggered = false;
        const unsubscribe = progress.on("change", () => {
          if (!hasTriggered && isMounted) {
            const currentX = x.get();
            const currentY = y.get();
            const textPos = TEXT_POSITIONS[currentTargetIndex];
            const dist = Math.hypot(currentX - textPos.x, currentY - textPos.y);
            if (dist < 18) { // trigger when within 18% of the text center
              hasTriggered = true;
              onImpact(currentTargetIndex, isPermanent);
            }
          }
        });
        
        await animate(progress, 1, { duration, ease: "easeInOut" });
        unsubscribe();
        
        if (!isMounted) break;
        
        if (!hasTriggered) {
          onImpact(currentTargetIndex, isPermanent);
        }
        
        await new Promise(r => setTimeout(r, 200));
        
        if (!isActiveRef.current) {
          const exit = OUTSIDE_SPAWNS[Math.floor(Math.random() * OUTSIDE_SPAWNS.length)];
          const eStartX = x.get();
          const eStartY = y.get();
          let eCtrlX = (eStartX + exit.x) / 2 + (Math.random() * 40 - 20);
          let eCtrlY = (eStartY + exit.y) / 2 + (Math.random() * 40 - 20);
          
          pathRef.current = { startX: eStartX, startY: eStartY, ctrlX: eCtrlX, ctrlY: eCtrlY, endX: exit.x, endY: exit.y };
          progress.set(0);
          
          const exitDuration = 1.5 + Math.random() * 0.5;
          await animate(progress, 1, { duration: exitDuration, ease: "easeInOut" });
          
          if (isMounted) {
            opacity.set(0);
          }
          
          isWaitingForActive = true;
        } else {
          recentTargetsRef.current.push(currentTargetIndex);
          if (recentTargetsRef.current.length > 2) {
            recentTargetsRef.current.shift();
          }
          currentTargetIndex = getNextTarget();
        }
      }
    };

    runLoop();
    return () => { isMounted = false; };
  }, [id, opacity, progress, x, y, isPermanent, onImpact]);

  useAnimationFrame(() => {
    const p = progress.get();
    if (p > 0 && p < 1) {
      const { startX, startY, ctrlX, ctrlY, endX, endY } = pathRef.current;
      const inv = 1 - p;
      const px = inv * inv * startX + 2 * inv * p * ctrlX + p * p * endX;
      const py = inv * inv * startY + 2 * inv * p * ctrlY + p * p * endY;
      
      const dx = 2 * inv * (ctrlX - startX) + 2 * p * (endX - ctrlX);
      const dy = 2 * inv * (ctrlY - startY) + 2 * p * (endY - ctrlY);
      
      x.set(px);
      y.set(py);
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        rotation.set(Math.atan2(dy, dx) * (180 / Math.PI));
      }
      
      if (onTriggerChange) {
        let foundInside = -1;
        for (let i = 0; i < TEXT_POSITIONS.length; i++) {
          const dist = Math.hypot(px - TEXT_POSITIONS[i].x, py - TEXT_POSITIONS[i].y);
          if (dist < 18) { // 18% viewport distance as trigger zone
            foundInside = i;
            break;
          }
        }
        
        if (foundInside !== currentInsideRef.current) {
          if (currentInsideRef.current !== -1) {
            onTriggerChange(currentInsideRef.current, false);
          }
          if (foundInside !== -1) {
            onTriggerChange(foundInside, true);
          }
          currentInsideRef.current = foundInside;
        }
      }
    }
  });

  return (
    <motion.div
      className="absolute w-12 h-[1.5px] flex items-center justify-end origin-right -mt-[0.75px] pointer-events-none z-0"
      style={{
        left: useTransform(x, v => `${v}%`),
        top: useTransform(y, v => `${v}%`),
        x: "-100%", // anchor right edge
        rotate: rotation,
        opacity
      }}
    >
      {/* Tail */}
      <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500/10 to-purple-500/30 rounded-full" />
      {/* Head */}
      <div className="absolute right-0 w-[1.5px] h-[1.5px] rounded-full bg-purple-200 shadow-[0_0_6px_1px_rgba(168,85,247,0.5)]" />
    </motion.div>
  );
};

const EnergyParticlesContainer: React.FC<{ transientActive: boolean; permanentActive: boolean; onImpact: (idx: number, isPermanent: boolean) => void; onTriggerChange?: (idx: number, isEntering: boolean) => void }> = ({ transientActive, permanentActive, onImpact, onTriggerChange }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible rounded-[2rem] z-0">
      <EnergyParticle id={1} isActive={permanentActive} onImpact={onImpact} isPermanent={true} onTriggerChange={onTriggerChange} />
      <EnergyParticle id={2} isActive={transientActive} onImpact={onImpact} isPermanent={false} />
      <EnergyParticle id={3} isActive={transientActive} onImpact={onImpact} isPermanent={false} />
      <EnergyParticle id={4} isActive={transientActive} onImpact={onImpact} isPermanent={false} />
      <EnergyParticle id={5} isActive={transientActive} onImpact={onImpact} isPermanent={false} />
      <EnergyParticle id={6} isActive={transientActive} onImpact={onImpact} isPermanent={false} />
    </div>
  );
};

const PrincipleItem: React.FC<{ principle: typeof PRINCIPLES[0], index: number, isRevealed?: boolean, shakeCounter: number, isPanelHovered: boolean }> = ({ principle, index, isRevealed, shakeCounter, isPanelHovered }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const hoverSpring = useSpring(0, { stiffness: 100, damping: 30 }); // soft spring

  useEffect(() => {
    hoverSpring.set(isHovered || isDragging ? 1 : 0);
  }, [isHovered, isDragging, hoverSpring]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);

  useEffect(() => {
    if (shakeCounter > 0) {
      const dirX = Math.random() > 0.5 ? 1 : -1;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      animate(shakeX, [0, 3 * dirX, -2 * dirX, 0], { duration: 0.3, ease: "easeInOut" });
      animate(shakeY, [0, 2 * dirY, -1 * dirY, 0], { duration: 0.3, ease: "easeInOut" });
    }
  }, [shakeCounter, shakeX, shakeY]);

  const phaseOffset = index * 0.6;

  useAnimationFrame((t) => {
    // 12 second loop -> 12000 ms
    const phase = (t / 12000) * Math.PI * 2 - phaseOffset;
    
    const hoverAmount = hoverSpring.get();
    
    const amp = 1 + hoverAmount * 0.5;
    const press = 1 + hoverAmount * 0.8;
    const currentBaseScale = 1.0 + hoverAmount * 0.02;

    const baseFloatX = Math.sin(phase) * 8 * amp;
    const pressure = Math.pow((Math.sin(phase) + 1) / 2, 6);
    
    x.set(baseFloatX);
    y.set(Math.cos(phase) * 4 * amp);
    scale.set(currentBaseScale + pressure * 0.015 * press);
  });

  const finalX = useTransform(() => x.get() + shakeX.get());
  const finalY = useTransform(() => y.get() + shakeY.get());
  
  const showExplanation = isHovered || isRevealed || isPanelHovered;

  return (
    <div 
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className={`relative z-10 group w-full max-w-max ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} hover:z-40`}
        style={{ zIndex: isDragging ? 50 : undefined }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -60, bottom: 60 }}
        dragSnapToOrigin={true}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 150, bounceDamping: 20 }}
        whileDrag={{ scale: 1.03 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        <motion.div style={{ x: finalX, y: finalY, scale }}>
          {/* Invisible Placeholder to reserve fixed container bounding box */}
          <div className="opacity-0 pointer-events-none select-none flex flex-col items-center text-center px-1">
            <h3 className="font-sans text-h3 font-medium leading-[1.05] whitespace-nowrap tracking-tight">
              {principle.lead} <span className="font-medium">
                {principle.accent}
              </span>
            </h3>
            <div className="mt-2.5 text-body max-w-md">
              {principle.description}
            </div>
          </div>

          {/* The Actual Interactive Text Area */}
          <div className="absolute inset-0 flex flex-col items-center text-center justify-center">
            {/* Heading */}
            <div 
              className={`transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showExplanation ? 'translate-y-0 text-[#F4F3EF]' : 'translate-y-3 sm:translate-y-3.5 text-[#8B8B8D]'
              }`}
            >
              <h3 className="font-sans text-h3 font-medium leading-[1.05] whitespace-nowrap tracking-tight">
                {principle.lead} <span className={`font-medium transition-colors duration-500 ${showExplanation ? 'text-[#F4F3EF]' : 'text-[#C9C2B4]'}`}>
                  {principle.accent}
                </span>
              </h3>
            </div>

            {/* Subtitle / Description */}
            <div 
              className={`transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-md ${
                showExplanation 
                  ? 'opacity-100 translate-y-0 mt-2.5' 
                  : 'opacity-0 translate-y-2.5 mt-0 pointer-events-none'
              }`}
            >
              <p className="font-sans text-body text-[#A09FA5] text-center">
                {principle.description}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const InternalEnergyCrack: React.FC<{ isHovered?: boolean }> = ({ isHovered }) => {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const inner1 = useAnimation();
  const inner2 = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      while (isMounted) {
        // Left to Center & Right to Center
        inner1.set({ scaleX: 1 }); // Particle 1 (Blue) moves right (tail extending left)
        inner2.set({ scaleX: -1 }); // Particle 2 (Purple) moves left (tail extending right)
        
        await Promise.all([
          controls1.start({
            left: ["-10%", "50%"],
            opacity: [0, 1, 1], // Fades in at edges, stays bright at center
            transition: { duration: 2.5, ease: "easeInOut" }
          }),
          controls2.start({
            left: ["110%", "50%"],
            opacity: [0, 1, 1],
            transition: { duration: 2.5, ease: "easeInOut" }
          })
        ]);

        if (!isMounted) break;

        // Clash / Interaction
        await Promise.all([
          controls1.start({
            scale: [1, 1.2, 1], 
            transition: { duration: 0.15, ease: "easeInOut" } // Very fast subtle impact
          }),
          controls2.start({
            scale: [1, 1.2, 1],
            transition: { duration: 0.15, ease: "easeInOut" }
          })
        ]);

        if (!isMounted) break;

        // Center to Edges
        inner1.set({ scaleX: -1 }); // Particle 1 (Blue) moves left (tail extending right)
        inner2.set({ scaleX: 1 }); // Particle 2 (Purple) moves right (tail extending left)

        await Promise.all([
          controls1.start({
            left: ["50%", "-10%"],
            opacity: [1, 1, 0], // Fades out as it hits edge
            transition: { duration: 2.5, ease: "easeInOut" }
          }),
          controls2.start({
            left: ["50%", "110%"],
            opacity: [1, 1, 0],
            transition: { duration: 2.5, ease: "easeInOut" }
          })
        ]);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [controls1, controls2, inner1, inner2]);

  return (
    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 pointer-events-none z-0">
      {/* Permanent low intensity line */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
        animate={{ 
          opacity: isHovered ? 1.5 : 0.8,
          scaleY: isHovered ? 1.2 : 1
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Animated Beams Wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Particle 1 */}
        <motion.div 
          animate={controls1}
          initial={{ opacity: 0, left: "50%" }}
          className="absolute top-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center"
        >
          <motion.div animate={inner1} className="absolute flex items-center justify-center">
            {/* Tail extending left */}
            <motion.div 
              className="absolute right-0 w-32 sm:w-48 md:w-64 h-px bg-gradient-to-l from-blue-500 to-transparent"
              animate={{ opacity: isHovered ? 0.8 : 0.4 }}
            />
            {/* Dot at center */}
            <motion.div 
              className="absolute rounded-full bg-blue-500"
              animate={{ 
                width: isHovered ? "3px" : "2px",
                height: isHovered ? "3px" : "2px",
                boxShadow: isHovered 
                  ? "0 0 16px 4px rgba(59,130,246,0.8), 0 0 4px 1px rgba(59,130,246,1)" 
                  : "0 0 10px 2px rgba(59,130,246,0.6)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Particle 2 */}
        <motion.div 
          animate={controls2}
          initial={{ opacity: 0, left: "50%" }}
          className="absolute top-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center"
        >
          <motion.div animate={inner2} className="absolute flex items-center justify-center">
            {/* Tail extending left */}
            <motion.div 
              className="absolute right-0 w-32 sm:w-48 md:w-64 h-px bg-gradient-to-l from-purple-500 to-transparent"
              animate={{ opacity: isHovered ? 0.8 : 0.4 }}
            />
            {/* Dot at center */}
            <motion.div 
              className="absolute rounded-full bg-purple-500"
              animate={{ 
                width: isHovered ? "3px" : "2px",
                height: isHovered ? "3px" : "2px",
                boxShadow: isHovered 
                  ? "0 0 16px 4px rgba(168,85,247,0.8), 0 0 4px 1px rgba(168,85,247,1)" 
                  : "0 0 10px 2px rgba(168,85,247,0.6)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export const PrinciplesSection: React.FC = () => {
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [shakeCounters, setShakeCounters] = useState<number[]>([0,0,0,0,0,0]);
  const sectionRef = useRef<HTMLElement>(null);
  const glassCardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const [transientActive, setTransientActive] = useState(false);
  const [permanentActive, setPermanentActive] = useState(false);

  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let timeout3: NodeJS.Timeout;

    if (isInView) {
      // 1. Breathing space before transient group
      timeout1 = setTimeout(() => {
        setTransientActive(true);
        // 2. Briefly move around then exit
        timeout2 = setTimeout(() => {
          setTransientActive(false);
          // 3. Breathing space before permanent tail
          timeout3 = setTimeout(() => {
            setPermanentActive(true);
          }, 2500);
        }, 5000); // 5 seconds of moving around
      }, 1500); // 1.5 seconds initial breathing space
    } else {
      // Section inactive, reset everything
      setTransientActive(false);
      setPermanentActive(false);
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [isInView]);

  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [autoTriggerEnabled, setAutoTriggerEnabled] = useState(true);
  const autoTriggerEnabledRef = useRef(true);

  useEffect(() => {
    autoTriggerEnabledRef.current = autoTriggerEnabled;
  }, [autoTriggerEnabled]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPanelHovered) {
      setAutoTriggerEnabled(false);
      setRevealedIndices(prev => (prev.size > 0 ? new Set() : prev));
    } else {
      timer = setTimeout(() => {
        setAutoTriggerEnabled(true);
      }, 1800); // 1.8s breathing delay
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isPanelHovered]);

  const handleImpact = useCallback((index: number, isPermanent: boolean) => {
    setShakeCounters(prev => {
      const next = [...prev];
      next[index]++;
      return next;
    });
  }, []);

  const handleTriggerChange = useCallback((index: number, isEntering: boolean) => {
    if (!autoTriggerEnabledRef.current) {
      return;
    }
    setRevealedIndices(prev => {
      const next = new Set(prev);
      if (isEntering) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  }, []);

  return (
    <section ref={sectionRef} id="principles" className="relative bg-[#000000] overflow-hidden flex flex-col items-center justify-between min-h-[100svh] h-[100svh] w-full py-4 sm:py-6 lg:py-8 mt-[50px]">
      
      {/* Section Label (Outside Glass Card) */}
      <div className="w-full max-w-[1310px] mx-auto px-4 sm:px-8 lg:px-0 flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-6 z-10 shrink-0">
        <div>
          <h2 className="font-sans text-h2 font-medium text-[#F4F3EF]">
            Design Philosophy
          </h2>
        </div>
      </div>

      {/* Central Glass Card */}
      <div 
        ref={glassCardRef}
        className="glass-card-medium relative w-full max-w-[1310px] lg:w-[1310px] mx-auto flex-1 min-h-0 z-10 border border-[#232326] rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] p-4 sm:p-8 md:p-10 lg:px-16 lg:py-8 flex flex-col justify-center overflow-hidden"
        onMouseEnter={() => setIsPanelHovered(true)}
        onMouseLeave={() => setIsPanelHovered(false)}
      >
        <EnergyParticlesContainer 
          transientActive={transientActive || isPanelHovered} 
          permanentActive={permanentActive || transientActive || isPanelHovered} 
          onImpact={handleImpact} 
          onTriggerChange={handleTriggerChange}
        />
        
        {/* Central Axis Composition Wrapper */}
        <div className="w-full relative flex flex-col justify-center my-auto">
          {/* Internal Energy Crack / Vein */}
          <InternalEnergyCrack isHovered={isPanelHovered} />

          {/* Principles Manifesto List */}
          <div className="w-full max-w-[1000px] mx-auto relative z-10 flex flex-col items-center py-1 sm:py-2 lg:py-4">
            
            {/* Top Item */}
            <div className="flex justify-center w-full mb-3 sm:mb-6 lg:mb-10">
              <PrincipleItem principle={PRINCIPLES[0]} index={0} isRevealed={revealedIndices.has(0)} shakeCounter={shakeCounters[0]} isPanelHovered={isPanelHovered} />
            </div>
            
            {/* Middle Top Row */}
            <div className="flex flex-col lg:flex-row justify-between w-full max-w-4xl gap-3 sm:gap-6 lg:gap-8 mb-3 sm:mb-8 lg:mb-14">
              <PrincipleItem principle={PRINCIPLES[1]} index={1} isRevealed={revealedIndices.has(1)} shakeCounter={shakeCounters[1]} isPanelHovered={isPanelHovered} />
              <PrincipleItem principle={PRINCIPLES[2]} index={2} isRevealed={revealedIndices.has(2)} shakeCounter={shakeCounters[2]} isPanelHovered={isPanelHovered} />
            </div>

            {/* Middle Bottom Row */}
            <div className="flex flex-col lg:flex-row justify-between w-full max-w-4xl gap-3 sm:gap-6 lg:gap-8 mb-3 sm:mb-6 lg:mb-10">
              <PrincipleItem principle={PRINCIPLES[3]} index={3} isRevealed={revealedIndices.has(3)} shakeCounter={shakeCounters[3]} isPanelHovered={isPanelHovered} />
              <PrincipleItem principle={PRINCIPLES[4]} index={4} isRevealed={revealedIndices.has(4)} shakeCounter={shakeCounters[4]} isPanelHovered={isPanelHovered} />
            </div>
            
            {/* Bottom Item */}
            <div className="flex justify-center w-full">
              <PrincipleItem principle={PRINCIPLES[5]} index={5} isRevealed={revealedIndices.has(5)} shakeCounter={shakeCounters[5]} isPanelHovered={isPanelHovered} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

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
          // Concurrent color swap and bounce at Left/Right edges
          animate(lightScale, [1, 1.2, 1], { duration: 0.15, ease: "easeInOut" });
          animate(colorProgress, 0, { duration: 0.15, ease: "easeInOut" });
        }
        initialLoop = false;
        
        isReversing.current = false;
        await animate(progress, 1, { duration: 2.5, ease: "easeInOut" });
        if (!isMounted) break;
        
        // Blocking interaction at Top/Bottom edges (Syncs with master clock)
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

