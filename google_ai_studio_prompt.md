# Google AI Studio Prompt

Copy and paste the prompt below into Google AI Studio. You can also copy the entire React component code provided below and paste it directly into the chat, or save it as `DisciplinesSection.tsx` and upload it.

***

### 📝 The Prompt to Copy

```text
I have a React component (DisciplinesSection.tsx) that implements a 3D orbital carousel. It features a highly polished, Apple-quality frosted glass design with a spherical "ball screen" curve style. 

Key features of this component's styling include:
1. Heavy spherical inset shadows (`box-shadow: inset 0 0 60px rgba(0,0,0,0.35), ...`) that create a deep, curved CRT/ball screen illusion.
2. A convex circular highlight (`radial-gradient(circle at 50% 40%...)`) simulating a curved glass surface.
3. An inner-wrapper architecture that isolates CSS hover scaling (`scale(1.04) translateZ(24px)`) from high-frequency JS orbital transforms.
4. A subtle liquid wave overlay (`mix-blend-mode: overlay`) that shimmers across the glass on hover.
5. A Google AI Studio-style animated edge light (`linear-gradient` with animated `background-position`) using a brand color.
6. Cinematic text layout (centered) with a hover-reveal animation (text translates up, subtitle fades in from below).

Please analyze this file. I want you to understand the specific CSS layers, backdrop filters, inset shadows, and radial gradients used to create this "ball screen" and premium frosted glass aesthetic, so we can replicate and adapt this exact visual style for other UI components in my project.
```

***

### 📄 The File Content (`DisciplinesSection.tsx`)

Copy the code below, or save it as a file and upload it alongside the prompt above.

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DISCIPLINES } from '../data/studioData';
import { Discipline } from '../types';
import { ArrowUpRight, Check, X, Sparkles, ChevronRight, ChevronLeft, Volume2, VolumeX, Pause, Play, Eye } from 'lucide-react';
import gsap from 'gsap';
import { CAPABILITIES_VIDEO } from '../constants/videoAssets';

interface DisciplinesSectionProps {
  onSelectDiscipline: (discipline: Discipline) => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({ onSelectDiscipline }) => {
  const totalItems = DISCIPLINES.length;

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
  const [isSectionMuted, setIsSectionMuted] = useState(true);
  const sectionVideoRef = useRef<HTMLVideoElement>(null);
  
  const currentPlaybackRateRef = useRef<number>(1.0);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoTranslateXRef = useRef<number>(0);
  const videoScaleRef = useRef<number>(1.0);
  
  const orbitalScaleRef = useRef<number>(1.0);
  const orbitalPerspectiveRef = useRef<number>(1800);
  const floatPhaseRef = useRef<number>(0);

  useEffect(() => {
    const video = sectionVideoRef.current;
    if (!video) return;
    video.muted = isSectionMuted;
    const playVideo = () => { if (video.paused) video.play().catch(() => {}); };
    playVideo();
    const handlePause = () => playVideo();
    const handleVisibilityChange = () => { if (!document.hidden) playVideo(); };
    video.addEventListener('pause', handlePause);
    video.addEventListener('stalled', playVideo);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', playVideo);
    return () => {
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('stalled', playVideo);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', playVideo);
    };
  }, [isSectionMuted]);

  const stepAngle = (2 * Math.PI) / totalItems;

  const updateOrbit = useCallback(() => {
    if (isAutoRotating && !isHovered && !isDragging && !activePortalModal) {
      angleRef.current -= 0.0018;
    } else if (!isDragging && Math.abs(velocityRef.current) > 0.0001) {
      angleRef.current += velocityRef.current;
      velocityRef.current *= 0.93; 
      if (Math.abs(velocityRef.current) <= 0.0001) velocityRef.current = 0;
    }

    const currentAngle = angleRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

    const radiusX = isMobile ? 220 : isTablet ? 380 : 510;
    const radiusZ = isMobile ? 160 : isTablet ? 280 : 380;
    const tiltAmplitude = isMobile ? 45 : isTablet ? 70 : 95; 
    const orbitalYOffset = isMobile ? 18 : isTablet ? 30 : 42; 

    let closestFrontIndex = 0;
    let minFrontDist = Infinity;

    cardsRef.current.forEach((cardEl, i) => {
      if (!cardEl) return;

      const cardAngle = currentAngle + i * stepAngle;
      const sinA = Math.sin(cardAngle);
      const cosA = Math.cos(cardAngle);

      const x = sinA * radiusX;
      const baseZ = cosA * radiusZ;
      const y = -cosA * tiltAmplitude + orbitalYOffset;

      const distFromFront = Math.hypot(sinA, 1 - cosA);
      if (distFromFront < minFrontDist) {
        minFrontDist = distFromFront;
        closestFrontIndex = i;
      }

      const frontFactor = Math.max(0, (cosA + 1) / 2);
      const scale = 0.44 + 0.56 * frontFactor;
      const rotateY = -sinA * 48;
      const rotateX = cosA * 12;
      const rotateZ = 0;

      let opacity = 1;
      let brightness = 100;
      let saturate = 100;
      let blur = 0;
      let zIndex = 25;

      if (cosA > 0.05) {
        zIndex = Math.round(30 + cosA * 50);
        opacity = Math.min(1, 0.45 + 0.55 * cosA);
        brightness = Math.round(70 + 30 * frontFactor);
        saturate = Math.round(65 + 35 * frontFactor);
        blur = (1 - frontFactor) * 1.2;
      } else if (cosA > -0.45) {
        zIndex = Math.round(8 + (cosA + 0.45) * 35);
        const arcRatio = (cosA + 0.45) / 0.5;
        opacity = Math.max(0.12, arcRatio * 0.45); 
        brightness = 35; 
        saturate = 30; 
        blur = (1 - arcRatio) * 3.5; 
      } else {
        zIndex = 2;
        opacity = 0.08; 
        brightness = 20; 
        saturate = 20; 
        blur = 4.5; 
      }

      cardEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${baseZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      cardEl.style.opacity = opacity.toFixed(3);
      cardEl.style.zIndex = zIndex.toString();
      cardEl.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness}%) saturate(${saturate}%)`;
      cardEl.style.pointerEvents = opacity < 0.2 ? 'none' : 'auto';
      cardEl.style.setProperty('--spec-x', sinA.toFixed(3));
    });

    const isInteracting = isDragging || isSnappingRef.current || Math.abs(velocityRef.current) > 0.0003;
    const targetOrbitalScale = isInteracting ? 1.06 : 1.0;
    const targetPerspective = isInteracting ? 1350 : 1800;

    orbitalScaleRef.current += (targetOrbitalScale - orbitalScaleRef.current) * 0.08;
    orbitalPerspectiveRef.current += (targetPerspective - orbitalPerspectiveRef.current) * 0.08;

    floatPhaseRef.current += 0.007;
    const floatY = Math.sin(floatPhaseRef.current) * 5;

    const stage = containerRef.current;
    if (stage) {
      stage.style.transform = `translateY(${floatY.toFixed(2)}px) scale(${orbitalScaleRef.current.toFixed(4)})`;
      stage.style.perspective = `${Math.round(orbitalPerspectiveRef.current)}px`;
    }

    if (closestFrontIndex !== activeCardIndex && !isDragging && !isSnappingRef.current) {
      setActiveCardIndex(closestFrontIndex);
    }

    const video = sectionVideoRef.current;
    if (video && video.paused) {
      video.play().catch(() => {});
    }

    if (video && video.duration > 0) {
      const vel = velocityRef.current;
      let targetRate = 1.0;
      if (Math.abs(vel) > 0.0002) {
        targetRate = vel < 0
          ? Math.min(1.8, 1.0 + Math.abs(vel) * 80)
          : Math.max(0.5, 1.0 - Math.abs(vel) * 80);
      }
      currentPlaybackRateRef.current += (targetRate - currentPlaybackRateRef.current) * 0.06;
      const clampedRate = Math.max(0.5, Math.min(1.8, currentPlaybackRateRef.current));
      if (Math.abs(video.playbackRate - clampedRate) > 0.02) {
        video.playbackRate = clampedRate;
      }
    }

    const videoWrapper = videoWrapperRef.current;
    if (videoWrapper) {
      const vel = velocityRef.current;
      const dragDelta = isDragging ? (angleRef.current - dragStartAngleRef.current) : 0;
      const motionSignal = isDragging ? dragDelta * 80 : vel * 400;

      const targetTX = Math.max(-30, Math.min(30, motionSignal));
      const targetScale = 1.0 + Math.min(0.05, Math.abs(motionSignal) * 0.0008);

      videoTranslateXRef.current += (targetTX - videoTranslateXRef.current) * 0.07;
      videoScaleRef.current += (targetScale - videoScaleRef.current) * 0.07;

      videoWrapper.style.transform = `translateX(${videoTranslateXRef.current.toFixed(2)}px) scale(${videoScaleRef.current.toFixed(4)})`;
    }

    requestRef.current = requestAnimationFrame(updateOrbit);
  }, [isAutoRotating, isHovered, isDragging, activePortalModal, totalItems, stepAngle, activeCardIndex]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateOrbit);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateOrbit]);

  const rotateToDiscipline = (index: number) => {
    isSnappingRef.current = true;
    velocityRef.current = 0;
    dragStartAngleRef.current = angleRef.current;

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
      className="bg-[#000000] text-[#F4F3EF] py-[50px] pl-[1px] relative overflow-hidden select-none"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 md:px-16 relative z-10">
        
        <div className="mb-10 sm:mb-16 border-b border-[#1C1C1E] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSectionMuted(!isSectionMuted)}
              className="p-2.5 rounded-full bg-[#141416]/80 hover:bg-[#232326] border border-[#232326] hover:border-[#60a5fa] text-[#8B8B8D] hover:text-[#F4F3EF] transition-colors"
            >
              {isSectionMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="relative w-full h-[420px] sm:h-[500px] md:h-[560px] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
            <div
              ref={videoWrapperRef}
              className="w-full h-full will-change-transform flex items-center justify-center"
              style={{ transformOrigin: 'center center' }}
            >
              <video
                ref={sectionVideoRef}
                src={CAPABILITIES_VIDEO}
                autoPlay
                loop
                muted={isSectionMuted}
                playsInline
                preload="auto"
                className="w-full h-full object-contain opacity-85 scale-95 pointer-events-none"
              />
            </div>
          </div>

          <div
            ref={containerRef}
            onMouseLeave={handleEnd}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onTouchStart={(e) => e.touches.length === 1 && handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => e.touches.length === 1 && handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
            className="relative z-10 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing py-6"
            style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
          >

          <style>{`
            @keyframes edgeTravelLight {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes glassSheen {
              0%   { transform: translateX(-110%) skewX(-18deg); }
              100% { transform: translateX(210%) skewX(-18deg); }
            }
            @keyframes ambientPulse {
              0%, 100% { opacity: 0.45; }
              50%       { opacity: 0.70; }
            }
            @keyframes liquidWave {
              0% { background-position: 0% 0%; }
              50% { background-position: 100% 100%; }
              100% { background-position: 0% 0%; }
            }

            .glass-convex-surface {
              position: absolute; inset: 0; pointer-events: none; z-index: 5;
              background: radial-gradient(
                circle at 50% 40%,
                rgba(255,255,255,0.18) 0%,
                rgba(255,255,255,0.05) 30%,
                transparent 55%,
                rgba(0,0,0,0.15) 80%,
                rgba(0,0,0,0.35) 100%
              );
            }

            .glass-specular-highlight {
              position: absolute; inset: 0; pointer-events: none; z-index: 6;
              background: radial-gradient(
                ellipse 55% 55% at calc(50% + var(--spec-x, 0) * -22%) 26%,
                rgba(255,255,255,0.16) 0%,
                rgba(255,255,255,0.04) 44%,
                transparent 65%
              );
            }

            .glass-inner-wrapper {
              transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
              transform-style: preserve-3d;
            }
            
            .glass-card:hover .glass-inner-wrapper {
              transform: scale(1.04) translateZ(24px);
            }

            .glass-card:hover .glass-main-panel {
              background: rgba(255,255,255,0.075) !important;
              backdrop-filter: blur(48px) saturate(1.6) !important;
              -webkit-backdrop-filter: blur(48px) saturate(1.6) !important;
              box-shadow:
                inset 0 0 60px rgba(0,0,0,0.35),
                inset 0 1.5px 2px rgba(255,255,255,0.50),
                inset 0 -1px 2px rgba(0,0,0,0.30),
                inset 20px 0 35px rgba(0,0,0,0.25),
                inset -20px 0 35px rgba(0,0,0,0.25),
                inset 0 -24px 35px rgba(0,0,0,0.25) !important;
            }

            .glass-shadow {
              transition: box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
            }
            .glass-card:hover .glass-shadow {
              box-shadow: 0 40px 100px rgba(0,0,0,0.70), 0 16px 40px rgba(0,0,0,0.40), 0 4px 12px rgba(0,0,0,0.20) !important;
              opacity: 1 !important;
            }

            .glass-liquid-wave {
              opacity: 0;
              transition: opacity 0.8s ease;
            }
            .glass-card:hover .glass-liquid-wave {
              opacity: 1;
            }

            .glass-edge-border {
              transition: opacity 0.6s ease;
              opacity: 0;
            }
            .glass-card:hover .glass-edge-border {
              opacity: 1;
            }
          `}</style>

          {DISCIPLINES.map((discipline, idx) => {
            const isFeaturedFront = activeCardIndex === idx;

            return (
              <div
                key={discipline.id}
                ref={(el) => { cardsRef.current[idx] = el; }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                  if (isFeaturedFront) {
                    handleOpenPortal(discipline);
                  } else {
                    rotateToDiscipline(idx);
                  }
                }}
                className="glass-card absolute top-1/2 left-1/2 select-none will-change-transform cursor-pointer group"
                style={{
                  width: 'clamp(320px, 40vw, 560px)',
                  aspectRatio: '16 / 9',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  transition: 'opacity 0.1s linear',
                }}
              >
                <div className="glass-inner-wrapper relative w-full h-full">

                  <div
                    className="glass-shadow absolute pointer-events-none opacity-80"
                    style={{
                      inset: '-3px',
                      borderRadius: '42px',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.40), 0 6px 16px rgba(0,0,0,0.20)',
                    }}
                  />

                  <div
                    className="glass-edge-border absolute inset-0 pointer-events-none z-10"
                    style={{
                      borderRadius: '41px',
                      padding: '1px',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.4) 25%, rgba(96,165,250,0.7) 50%, rgba(96,165,250,0.4) 75%, transparent 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'edgeTravelLight 5s linear infinite',
                    }}
                  >
                    <div className="w-full h-full rounded-[40px] bg-transparent" />
                  </div>

                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      borderRadius: '41px',
                      padding: '1px',
                      background: 'linear-gradient(135deg, rgba(200,215,255,0.35) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 60%, rgba(180,200,255,0.25) 100%)',
                    }}
                  >
                    <div className="w-full h-full rounded-[40px] bg-transparent" />
                  </div>

                  <div
                    className="glass-main-panel relative w-full h-full overflow-hidden flex flex-col justify-center items-center text-center"
                    style={{
                      borderRadius: '40px',
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(48px) saturate(1.4)',
                      WebkitBackdropFilter: 'blur(48px) saturate(1.4)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: [
                        'inset 0 0 60px rgba(0,0,0,0.35)',
                        'inset 0 1.5px 2px rgba(255,255,255,0.50)',
                        'inset 0 -1px 2px rgba(0,0,0,0.30)',
                        'inset 20px 0 35px rgba(0,0,0,0.25)',
                        'inset -20px 0 35px rgba(0,0,0,0.25)',
                        'inset 0 -24px 35px rgba(0,0,0,0.25)',
                      ].join(', '),
                      transition: 'background 0.6s ease, box-shadow 0.6s ease, backdrop-filter 0.6s ease',
                    }}
                  >
                    {discipline.bgVideoUrl && (
                      <video
                        src={discipline.bgVideoUrl}
                        autoPlay loop muted playsInline
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: 'brightness(0.68) contrast(1.10) saturate(0.85)' }}
                      />
                    )}

                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                      }}
                    />

                    <div className="glass-convex-surface" />
                    <div className="glass-specular-highlight" />

                    <div
                      className="glass-liquid-wave absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: 'radial-gradient(circle 80% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)',
                        backgroundSize: '150% 150%',
                        animation: 'liquidWave 8s ease-in-out infinite alternate',
                        mixBlendMode: 'overlay',
                      }}
                    />

                    <div
                      className="absolute top-0 left-0 right-0 pointer-events-none"
                      style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(160,200,255,0.20) 15%, rgba(255,255,255,0.60) 40%, rgba(220,235,255,0.75) 50%, rgba(255,255,255,0.60) 60%, rgba(160,200,255,0.20) 85%, transparent 100%)',
                      }}
                    />

                    <div
                      className="absolute top-0 left-0 right-0 pointer-events-none"
                      style={{
                        height: '28%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                        borderRadius: '20px 20px 0 0',
                      }}
                    />

                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '20px' }}>
                      <div
                        className="absolute top-0 bottom-0"
                        style={{
                          width: '25%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                          animation: 'glassSheen 12s ease-in-out infinite',
                          animationDelay: `${idx * 0.8}s`,
                        }}
                      />
                    </div>

                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(180,200,255,0.06) 0%, transparent 100%)',
                        animation: 'ambientPulse 7s ease-in-out infinite',
                        animationDelay: `${idx * 0.5}s`,
                      }}
                    />

                    <div className="relative z-20 px-8 flex flex-col items-center justify-center w-full h-full pointer-events-none">
                      <h3
                        className="font-serif-custom font-light leading-tight transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3"
                        style={{
                          fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                          color: 'rgba(244,243,239,0.98)',
                          textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {discipline.name}
                      </h3>

                      <div className="absolute top-[55%] left-0 w-full px-8">
                        <p
                          className="font-sans leading-relaxed mx-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                          style={{
                            fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                            color: 'rgba(230,235,245,0.9)',
                            textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                            maxWidth: '90%',
                          }}
                        >
                          {discipline.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```
