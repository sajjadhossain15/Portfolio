import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DISCIPLINES } from '../data/studioData';
import { Discipline } from '../types';
import { ArrowUpRight, Check, X, Sparkles, ChevronRight, ChevronLeft, Volume2, VolumeX, Pause, Play, Eye } from 'lucide-react';
import gsap from 'gsap';

interface DisciplinesSectionProps {
  onSelectDiscipline: (discipline: Discipline) => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({ onSelectDiscipline }) => {
  const totalItems = DISCIPLINES.length;

  // Orbital mechanics angle in radians
  const angleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isSnappingRef = useRef<boolean>(false);

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const dragStartXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number | null>(null);

  const [activePortalModal, setActivePortalModal] = useState<Discipline | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Equal angular step between all items (2PI / 9)
  const stepAngle = (2 * Math.PI) / totalItems;

  // Main 60 FPS 3D Spherical Orbit & Perspective Render Loop
  const updateOrbit = useCallback(() => {
    // 1. Gentle auto-rotation in reverse direction when idle
    if (isAutoRotating && !isHovered && !isDragging && !activePortalModal) {
      angleRef.current -= 0.0018;
    } else if (!isDragging && Math.abs(velocityRef.current) > 0.0001) {
      // 2. Smooth inertial momentum decay
      angleRef.current += velocityRef.current;
      velocityRef.current *= 0.93; // Smooth friction damping

      if (Math.abs(velocityRef.current) <= 0.0001) {
        velocityRef.current = 0;
      }
    }

    const currentAngle = angleRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

    // Radius specs for continuous 3D Inclined Orbital Ring (Tighter card spacing)
    const radiusX = isMobile ? 220 : isTablet ? 380 : 510;
    const radiusZ = isMobile ? 160 : isTablet ? 280 : 380;
    const tiltAmplitude = isMobile ? 45 : isTablet ? 70 : 95; // Inclined ring vertical displacement

    let closestFrontIndex = 0;
    let minFrontDist = Infinity;

    // Render every card attached to the continuous 3D Orbital Ring
    cardsRef.current.forEach((cardEl, i) => {
      if (!cardEl) return;

      const cardAngle = currentAngle + i * stepAngle;
      
      const sinA = Math.sin(cardAngle);
      const cosA = Math.cos(cardAngle);

      // True 3D Inclined Orbital Ring Coordinates (X, Y, Z)
      const x = sinA * radiusX;
      const baseZ = cosA * radiusZ;
      // Ring elevation tilt (front arc dips slightly lower, back arc rises higher symmetrically for left/right)
      const y = -cosA * tiltAmplitude;

      // Track frontmost card
      const distFromFront = Math.hypot(sinA, 1 - cosA);
      if (distFromFront < minFrontDist) {
        minFrontDist = distFromFront;
        closestFrontIndex = i;
      }

      // Depth factors along the orbital ring (front = cosA > 0, back = cosA < 0)
      const frontFactor = Math.max(0, (cosA + 1) / 2); // 0 (far back) to 1 (front center)

      // Continuous 3D perspective scaling along orbital ring
      const scale = 0.44 + 0.56 * frontFactor;

      // 3D Rotations along orbital ring:
      // rotateY rotates tangent to the ring circle
      const rotateY = -sinA * 48;
      // rotateX tilts card aligned with the orbital ring plane incline
      const rotateX = cosA * 12;
      // rotateZ keeps card roll balanced
      const rotateZ = 0;

      // Occlusion & Orbital Ring Horizon Depth
      let opacity = 1;
      let brightness = 100;
      let saturate = 100;
      let blur = 0;
      let zIndex = 25;

      if (cosA > 0.05) {
        // Front Arc of Orbital Ring
        zIndex = Math.round(30 + cosA * 50);
        opacity = Math.min(1, 0.45 + 0.55 * cosA);
        brightness = Math.round(70 + 30 * frontFactor);
        saturate = Math.round(65 + 35 * frontFactor);
        blur = (1 - frontFactor) * 1.2;
      } else if (cosA > -0.45) {
        // Side/Back Arc of Ring
        zIndex = Math.round(8 + (cosA + 0.45) * 35);
        const arcRatio = (cosA + 0.45) / 0.5;
        opacity = Math.max(0.18, arcRatio * 0.45);
        brightness = 40;
        saturate = 35;
        blur = (1 - arcRatio) * 2.5;
      } else {
        // Far Back Arc of Ring (smoothly dimmed in background depth)
        zIndex = 2;
        opacity = 0.15;
        brightness = 25;
        saturate = 25;
        blur = 3.5;
      }

      // Apply 3D GPU transform & depth styling
      cardEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${baseZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      cardEl.style.opacity = opacity.toFixed(3);
      cardEl.style.zIndex = zIndex.toString();
      cardEl.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness}%) saturate(${saturate}%)`;
      cardEl.style.pointerEvents = opacity < 0.2 ? 'none' : 'auto';
    });

    if (closestFrontIndex !== activeCardIndex && !isDragging && !isSnappingRef.current) {
      setActiveCardIndex(closestFrontIndex);
    }

    requestRef.current = requestAnimationFrame(updateOrbit);
  }, [isAutoRotating, isHovered, isDragging, activePortalModal, totalItems, stepAngle, activeCardIndex]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateOrbit);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateOrbit]);

  // Rotate smoothly to specific discipline index
  const rotateToDiscipline = (index: number) => {
    isSnappingRef.current = true;
    velocityRef.current = 0;

    const currentAngle = angleRef.current;
    const currentK = Math.round((-currentAngle - index * stepAngle) / (2 * Math.PI));
    const targetAngle = -index * stepAngle - currentK * 2 * Math.PI;

    gsap.to(angleRef, {
      current: targetAngle,
      duration: 1.1,
      ease: 'power3.out',
      onComplete: () => {
        isSnappingRef.current = false;
        setActiveCardIndex(index);
      },
    });
    setActiveCardIndex(index);
  };

  const handleNext = () => {
    const nextIdx = (activeCardIndex + 1) % totalItems;
    rotateToDiscipline(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeCardIndex - 1 + totalItems) % totalItems;
    rotateToDiscipline(prevIdx);
  };

  // Dragging / Gesture Handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    isSnappingRef.current = false;
    gsap.killTweensOf(angleRef);
    velocityRef.current = 0;
    dragStartXRef.current = clientX;
    dragStartAngleRef.current = angleRef.current;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartXRef.current;
    const sens = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.0030 : 0.0018;
    angleRef.current = dragStartAngleRef.current + deltaX * sens;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 8) {
      const dx = clientX - lastXRef.current;
      velocityRef.current = (dx / dt) * sens * 14;
      lastXRef.current = clientX;
      lastTimeRef.current = now;
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  const handleOpenPortal = (discipline: Discipline) => {
    setActivePortalModal(discipline);
    onSelectDiscipline(discipline);
  };

  return (
    <section
      id="disciplines"
      className="bg-[#000000] text-[#F4F3EF] py-24 sm:py-36 relative overflow-hidden select-none h-[1000px]"
      style={{ height: '1000px' }}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 md:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-16 border-b border-[#1C1C1E] pb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#60a5fa]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#8B8B8D] font-mono">
              Capabilities Matrix
            </span>
          </div>
          <h2 className="font-serif-custom text-3xl sm:text-5xl md:text-6xl font-light text-[#F4F3EF] tracking-tight">
            Our Capabilities
          </h2>
        </div>

        {/* 3D Orbital Carousel Stage */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleEnd();
          }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onTouchStart={(e) => e.touches.length === 1 && handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => e.touches.length === 1 && handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          className="relative w-full h-[520px] sm:h-[620px] md:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible py-6"
          style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
        >
          {/* Continuous Curved Orbital Ring Track Frame (Subtle Space Guide) */}
          <div className="absolute w-[680px] sm:w-[980px] lg:w-[1220px] h-[300px] sm:h-[360px] rounded-[50%] border border-white/5 pointer-events-none transform rotateX(70deg) z-0" />

          {/* ========================================================= */}
          {/* OPTICAL GLASS CAROUSEL CARDS (Orbital Ring Panels)       */}
          {/* ========================================================= */}
          <style>{`
            @keyframes rgbEdgeFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes glassLightSweep {
              0% { transform: translateX(-120%) translateY(-120%) rotate(25deg); }
              50% { transform: translateX(120%) translateY(120%) rotate(25deg); }
              100% { transform: translateX(-120%) translateY(-120%) rotate(25deg); }
            }
            @keyframes crtShimmer {
              0% { background-position: 0 0; opacity: 0.08; }
              50% { background-position: 0 4px; opacity: 0.16; }
              100% { background-position: 0 0; opacity: 0.08; }
            }
            @keyframes starTwinkle1 {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.3); }
            }
            @keyframes starTwinkle2 {
              0%, 100% { opacity: 0.85; transform: scale(1.2); }
              50% { opacity: 0.25; transform: scale(0.7); }
            }
            @keyframes stardustFlow {
              0% { transform: translateY(0%) translateX(0%) rotate(0deg); }
              50% { transform: translateY(-12%) translateX(8%) rotate(6deg); }
              100% { transform: translateY(0%) translateX(0%) rotate(0deg); }
            }
          `}</style>

          {DISCIPLINES.map((discipline, idx) => {
            const isFeaturedFront = activeCardIndex === idx;

            return (
              <div
                key={discipline.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onClick={() => {
                  if (isFeaturedFront) {
                    handleOpenPortal(discipline);
                  } else {
                    rotateToDiscipline(idx);
                  }
                }}
                /* 16:10 Premium Optical Glass Orbital Panel: 5-8px thick slab attached to orbital ring */
                className="absolute top-1/2 left-1/2 w-[52vw] sm:w-[36vw] md:w-[26vw] max-w-[320px] lg:max-w-[340px] aspect-[16/10] rounded-[20px] sm:rounded-[24px] p-[5px] overflow-visible group cursor-pointer hover:scale-[1.04] transition-all duration-500 ease-out select-none will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* ========================================================= */}
                {/* ULTRA-THIN RGB EDGE LIGHTING (Google AI Studio inspired)   */}
                {/* Glows strictly INSIDE the 5-8px glass edge thickness only when cursor enters carousel */}
                {/* Colors restricted strictly to Cyan, Electric Blue, Violet */}
                {/* ========================================================= */}
                <div
                  className={`absolute inset-0 rounded-[24px] sm:rounded-[28px] transition-all duration-700 pointer-events-none z-0 ${
                    isHovered ? 'opacity-35 group-hover:opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    padding: '2px',
                    background: 'linear-gradient(115deg, #06b6d4 0%, #3b82f6 35%, #8b5cf6 70%, #06b6d4 100%)',
                    backgroundSize: '250% 250%',
                    animation: 'rgbEdgeFlow 7s linear infinite',
                    filter: 'blur(1.2px)', // Strictly constrained within glass border thickness; zero wide bloom
                  }}
                />

                {/* 5-8px Physical Optical Glass Slab Depth Layer */}
                <div
                  className="absolute inset-[1px] rounded-[22px] sm:rounded-[26px] border-[6px] border-white/10 bg-[#000000]/85 pointer-events-none z-0 shadow-2xl"
                  style={{ transform: 'translateZ(-6px)' }}
                />

                {/* ========================================================= */}
                {/* FROSTED OPTICAL GLASS BODY & CRT DISPLAY SURFACE           */}
                {/* ========================================================= */}
                <div 
                  className="relative w-full h-full rounded-[19px] sm:rounded-[23px] border-[5px] border-white/20 group-hover:border-white/50 overflow-hidden backdrop-blur-3xl flex flex-col justify-between z-10 transition-all duration-500 shadow-[0_30px_80px_rgba(0,0,0,0.95),inset_0_1.5px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.9)]"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* CRT Microscopic Scanline & Electronic Shimmer Activity inside Glass */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)',
                      backgroundSize: '100% 4px',
                      animation: 'crtShimmer 4s ease-in-out infinite',
                    }}
                  />

                  {/* Glass Reflection Mesh & Fresnel Glare */}
                  <div 
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.18)_0%,rgba(0,0,0,0.75)_85%)] pointer-events-none z-20 mix-blend-overlay"
                    style={{ transform: 'translateZ(10px)' }}
                  />
                  
                  {/* Fresnel Reflection Glare Sweep across surface */}
                  <div
                    className="absolute -inset-[100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-white/12 to-transparent pointer-events-none z-20 group-hover:via-white/35 transition-all duration-700"
                    style={{ animation: 'glassLightSweep 12s ease-in-out infinite' }}
                  />

                  {/* Embedded Living Window Video */}
                  {discipline.bgVideoUrl && (
                    <video
                      src={discipline.bgVideoUrl}
                      poster={discipline.previewImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.62] contrast-[1.15] group-hover:brightness-100 group-hover:contrast-[1.20] group-hover:scale-[1.05] transition-all duration-700 pointer-events-none opacity-90"
                    />
                  )}

                  {/* Space Atmosphere INSIDE Glass Volume: Tiny Floating Stars & Cosmic Dust */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen opacity-70 group-hover:opacity-95 transition-opacity duration-500">
                    <div
                      className="absolute -inset-[50%] w-[200%] h-[200%] opacity-60"
                      style={{
                        background: `
                          radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.35), transparent 50%),
                          radial-gradient(circle at 75% 65%, rgba(59, 130, 246, 0.4), transparent 50%),
                          radial-gradient(circle at 45% 85%, rgba(236, 72, 153, 0.3), transparent 45%)
                        `,
                        animation: 'stardustFlow 20s ease-in-out infinite alternate',
                      }}
                    />

                    <svg className="absolute inset-0 w-full h-full">
                      <g style={{ animation: 'starTwinkle1 3.5s ease-in-out infinite alternate' }}>
                        <circle cx="18%" cy="22%" r="1.4" fill="#ffffff" />
                        <circle cx="80%" cy="16%" r="1.8" fill="#93c5fd" />
                        <circle cx="60%" cy="38%" r="1.2" fill="#ffffff" />
                        <circle cx="28%" cy="72%" r="1.6" fill="#e0e7ff" />
                        <circle cx="85%" cy="75%" r="1.4" fill="#a855f7" />
                        <circle cx="45%" cy="82%" r="2" fill="#38bdf8" />
                      </g>
                      <g style={{ animation: 'starTwinkle2 5s ease-in-out infinite alternate' }}>
                        <circle cx="38%" cy="15%" r="1.8" fill="#38bdf8" />
                        <circle cx="72%" cy="45%" r="1.2" fill="#ffffff" />
                        <circle cx="52%" cy="58%" r="1.5" fill="#f472b6" />
                        <circle cx="15%" cy="82%" r="1" fill="#93c5fd" />
                        <circle cx="90%" cy="32%" r="2" fill="#ffffff" />
                      </g>
                    </svg>
                  </div>

                  {/* Dark Gradient Overlay for Typography Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/35 to-transparent pointer-events-none group-hover:from-[#000000]/90 transition-all duration-500 z-10" />

                  {/* Header Badge */}
                  <div className="relative z-30 p-4 sm:p-5 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#60a5fa] font-bold bg-[#000000]/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      {discipline.index} / 09
                    </span>

                    <div className="w-8 h-8 rounded-full bg-[#000000]/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F4F3EF] group-hover:bg-[#3b82f6] group-hover:text-[#000000] group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Active Theory Style Hover Reveal Content */}
                  <div className="relative z-30 p-4 sm:p-5 sm:pb-6 flex flex-col justify-end">
                    <h3 className="font-serif-custom text-2xl sm:text-3xl md:text-4xl font-light text-[#F4F3EF] group-hover:text-[#60a5fa] transition-colors leading-tight drop-shadow-lg mb-1">
                      {discipline.name}
                    </h3>

                    <div className="max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out overflow-hidden space-y-2">
                      <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed font-sans line-clamp-2">
                        {discipline.tagline}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#60a5fa] font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-widest">Click to Enter World →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN CINEMATIC PORTAL PAGE MODAL                    */}
      {/* ========================================================= */}
      {activePortalModal && (
        <div className="fixed inset-0 z-50 bg-[#000000] text-[#F4F3EF] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
          
          {/* Ambient Video Background */}
          <div className="fixed inset-0 z-0 bg-[#000000] pointer-events-none">
            {activePortalModal.bgVideoUrl ? (
              <video
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster={activePortalModal.previewImage}
                className="w-full h-full object-cover filter brightness-50 contrast-110 scale-105"
                src={activePortalModal.bgVideoUrl}
              />
            ) : (
              <img
                src={activePortalModal.previewImage}
                alt={activePortalModal.name}
                className="w-full h-full object-cover filter brightness-50 contrast-110 scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-[#000000]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),rgba(0,0,0,0.95))]" />
          </div>

          {/* Top Navigation */}
          <div className="relative z-20 max-w-[1600px] w-full mx-auto px-6 sm:px-12 pt-8 sm:pt-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#60a5fa]">
                Portal {activePortalModal.index} / 09
              </span>
              <span className="text-[#1C1C1E]">|</span>
              <span className="text-xs font-mono uppercase text-[#8B8B8D] hidden sm:inline">
                {activePortalModal.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {activePortalModal.bgVideoUrl && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 rounded-full bg-[#0A0A0C]/80 backdrop-blur-md border border-[#1C1C1E] text-[#8B8B8D] hover:text-[#F4F3EF] hover:border-[#3b82f6] transition-colors"
                  title={isMuted ? 'Unmute Portal Sound' : 'Mute Portal Sound'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => setActivePortalModal(null)}
                className="flex items-center gap-2 bg-[#F4F3EF] text-[#000000] px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#3b82f6] transition-all shadow-2xl"
              >
                <span>Exit Portal</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Portal Content */}
          <div className="relative z-20 max-w-[1400px] w-full mx-auto px-6 sm:px-12 py-16 sm:py-24 my-auto">
            <div className="max-w-4xl space-y-8">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated Discipline World</span>
              </div>

              <h1 className="font-serif-custom text-4xl sm:text-6xl md:text-8xl font-light text-[#F4F3EF] leading-none tracking-tight">
                {activePortalModal.name}
              </h1>

              {activePortalModal.portalWorldQuote && (
                <blockquote className="font-serif-custom text-xl sm:text-3xl text-[#C9C2B4] italic font-light border-l-2 border-[#3b82f6] pl-6 py-2 leading-relaxed">
                  "{activePortalModal.portalWorldQuote}"
                </blockquote>
              )}

              <p className="text-base sm:text-xl text-[#8B8B8D] leading-relaxed font-sans max-w-3xl">
                {activePortalModal.description}
              </p>

              {/* Deliverables Breakdown */}
              <div className="pt-8 border-t border-[#1C1C1E]">
                <h4 className="text-xs uppercase tracking-[0.25em] text-[#8B8B8D] font-mono mb-6">
                  Core Technical Capabilities &amp; Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activePortalModal.deliverables.map((deliverable) => (
                    <div
                      key={deliverable}
                      className="flex items-center gap-3 bg-[#0A0A0C]/80 backdrop-blur-xl p-4 rounded-xl border border-[#1C1C1E] text-xs sm:text-sm text-[#F4F3EF]"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#3b82f6]/20 text-[#60a5fa] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#work"
                  onClick={() => setActivePortalModal(null)}
                  className="bg-[#F4F3EF] text-[#000000] px-8 py-4 rounded-xl text-xs font-mono uppercase tracking-widest font-bold hover:bg-[#3b82f6] transition-all flex items-center gap-2 shadow-2xl"
                >
                  <span>Explore Featured Works</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  onClick={() => setActivePortalModal(null)}
                  className="bg-[#0A0A0C]/80 text-[#F4F3EF] border border-[#1C1C1E] px-8 py-4 rounded-xl text-xs font-mono uppercase tracking-widest hover:border-[#3b82f6] transition-all"
                >
                  Initiate Commission
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Switcher */}
          <div className="relative z-20 max-w-[1600px] w-full mx-auto px-6 sm:px-12 pb-8 sm:pb-12 flex items-center justify-between border-t border-[#1C1C1E] pt-6">
            <button
              onClick={() => {
                const currentIdx = DISCIPLINES.findIndex((d) => d.id === activePortalModal.id);
                const prevIdx = (currentIdx - 1 + totalItems) % totalItems;
                setActivePortalModal(DISCIPLINES[prevIdx]);
              }}
              className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#8B8B8D] hover:text-[#F4F3EF] transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 text-[#60a5fa] group-hover:-translate-x-1 transition-transform" />
              <span>Previous Capability</span>
            </button>

            <span className="text-xs font-mono text-[#8B8B8D] hidden sm:inline">
              CAPABILITIES WORLD EXPEDITION
            </span>

            <button
              onClick={() => {
                const currentIdx = DISCIPLINES.findIndex((d) => d.id === activePortalModal.id);
                const nextIdx = (currentIdx + 1) % totalItems;
                setActivePortalModal(DISCIPLINES[nextIdx]);
              }}
              className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#8B8B8D] hover:text-[#F4F3EF] transition-colors group"
            >
              <span>Next Capability</span>
              <ChevronRight className="w-5 h-5 text-[#60a5fa] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

