import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DISCIPLINES } from '../data/studioData';
import { Discipline } from '../types';
import { ArrowUpRight, ArrowRight, Check, X, Sparkles, ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';

// Deterministic procedural atmosphere particles & haze generator per card seed
type AtmosphereParticleType = 'tiny_star' | 'floating_dust' | 'soft_haze' | 'fine_speck' | 'micro_optical';
type ParticleDepthLayer = 'bg' | 'mid' | 'fg';

interface EnhancedAtmosphereParticle {
  id: number;
  type: AtmosphereParticleType;
  layer: ParticleDepthLayer;
  x: number;
  y: number;
  size: number;
  color: string;
  baseOpacity: number;
  floatDuration: number;
  floatDelay: number;
  pathKeyframe: number;
  isOrbital: boolean;
  orbitRx: number;
  orbitRy: number;
  orbitAngle: number;
  isTwinkler: boolean;
  twinkleDuration: number;
  twinkleDelay: number;
}

interface EnhancedCardAtmosphereConfig {
  particles: EnhancedAtmosphereParticle[];
  hazeX: number;
  hazeY: number;
  hazeRadius: number;
  hazeOpacity: number;
  hazeDuration: number;
  hazeDelay: number;
}

const getCardAtmosphereConfig = (seed: number): EnhancedCardAtmosphereConfig => {
  let s = (seed + 1) * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const particles: EnhancedAtmosphereParticle[] = [];
  const particleTypes: AtmosphereParticleType[] = [
    'tiny_star', 'floating_dust', 'fine_speck', 'micro_optical', 'soft_haze',
    'fine_speck', 'floating_dust', 'tiny_star', 'micro_optical', 'fine_speck'
  ];

  let twinklerCount = 0;
  const count = 28;

  for (let i = 0; i < count; i++) {
    const type = particleTypes[i % particleTypes.length];
    
    // Depth layer assignment
    const layerRnd = rnd();
    const layer: ParticleDepthLayer = layerRnd < 0.35 ? 'bg' : layerRnd < 0.75 ? 'mid' : 'fg';

    // 10-15% follow micro orbital path
    const isOrbital = type === 'micro_optical' || (rnd() < 0.12);

    // Only 1-2 star particles per card are designated as twinklers
    const isTwinkler = type === 'tiny_star' && twinklerCount < 2 && rnd() < 0.45;
    if (isTwinkler) twinklerCount++;

    // Layer multipliers (background slower, foreground faster)
    const speedMult = layer === 'bg' ? 1.45 : layer === 'mid' ? 1.0 : 0.75;
    const sizeMult = layer === 'bg' ? 0.75 : layer === 'mid' ? 1.0 : 1.35;

    let size = 1.0;
    let baseOpacity = 0.35;
    let color = 'rgba(255, 255, 255, 0.7)';

    if (type === 'tiny_star') {
      size = (0.7 + rnd() * 0.7) * sizeMult;
      baseOpacity = 0.30 + rnd() * 0.35;
      color = rnd() > 0.3 ? '#F2F7FF' : '#E6F0FF';
    } else if (type === 'floating_dust') {
      size = (1.2 + rnd() * 1.1) * sizeMult;
      baseOpacity = 0.22 + rnd() * 0.28;
      color = 'rgba(225, 238, 255, 0.65)';
    } else if (type === 'fine_speck') {
      size = (0.5 + rnd() * 0.5) * sizeMult;
      baseOpacity = 0.25 + rnd() * 0.35;
      color = 'rgba(240, 248, 255, 0.8)';
    } else if (type === 'micro_optical') {
      size = (1.0 + rnd() * 0.7) * sizeMult;
      baseOpacity = 0.25 + rnd() * 0.30;
      color = 'rgba(210, 235, 255, 0.75)';
    } else if (type === 'soft_haze') {
      size = (20 + rnd() * 22) * sizeMult;
      baseOpacity = 0.025 + rnd() * 0.035;
      color = 'rgba(220, 238, 255, 0.05)';
    }

    particles.push({
      id: i,
      type,
      layer,
      x: Number((rnd() * 94 + 3).toFixed(1)),
      y: Number((rnd() * 94 + 3).toFixed(1)),
      size: Number(size.toFixed(2)),
      color,
      baseOpacity: Number(baseOpacity.toFixed(3)),
      floatDuration: Number(((15 + rnd() * 18) * speedMult).toFixed(1)),
      floatDelay: Number((rnd() * -30).toFixed(1)),
      pathKeyframe: Math.floor(rnd() * 5),
      isOrbital,
      orbitRx: Number((5 + rnd() * 8).toFixed(1)),
      orbitRy: Number((2 + rnd() * 4).toFixed(1)),
      orbitAngle: Math.floor(rnd() * 360),
      isTwinkler,
      twinkleDuration: Number((6 + rnd() * 4).toFixed(1)),
      twinkleDelay: Number((rnd() * -10).toFixed(1)),
    });
  }

  return {
    particles,
    hazeX: Math.round(20 + rnd() * 60),
    hazeY: Math.round(15 + rnd() * 60),
    hazeRadius: Math.round(45 + rnd() * 30),
    hazeOpacity: Number((0.04 + rnd() * 0.04).toFixed(3)),
    hazeDuration: Number((18 + rnd() * 12).toFixed(1)),
    hazeDelay: Number((rnd() * -20).toFixed(1)),
  };
};

// Unique procedural atmosphere configs for every card
const CARD_ATMOSPHERES = DISCIPLINES.map((_, idx) => getCardAtmosphereConfig(idx * 17 + 31));

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
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leanRef = useRef<number>(0);

  const sectionRef = useRef<HTMLElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitWrapperRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardVideosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const typoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardBoostsRef = useRef<{ z: number; scale: number }[]>([]);
  const cardHoverProgressRef = useRef<{ progress: number }[]>([]);
  const cardSweepProgressRef = useRef<{ [key: number]: { pos: number; opacity: number } }>({});
  const requestRef = useRef<number | null>(null);

  const triggerReflectionSweep = useCallback((cardIndex: number) => {
    if (!cardSweepProgressRef.current[cardIndex]) {
      cardSweepProgressRef.current[cardIndex] = { pos: 0, opacity: 0 };
    }
    const targetObj = cardSweepProgressRef.current[cardIndex];
    gsap.killTweensOf(targetObj);
    
    targetObj.pos = 0;
    targetObj.opacity = 0;

    gsap.to(targetObj, {
      pos: 1,
      duration: 0.25, // 250ms single pass
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      onUpdate: () => {
        const progress = targetObj.pos;
        // Bell-curve opacity envelope: peaks smoothly at 0.14 opacity in the middle, zero at ends
        const opacity = Math.sin(progress * Math.PI) * 0.14;
        targetObj.opacity = opacity;
        const el = cardsRef.current[cardIndex];
        if (el) {
          el.style.setProperty('--sweep-pos', progress.toFixed(3));
          el.style.setProperty('--sweep-opacity', opacity.toFixed(3));
        }
      },
      onComplete: () => {
        const el = cardsRef.current[cardIndex];
        if (el) {
          el.style.setProperty('--sweep-opacity', '0');
        }
      },
    });
  }, []);

  type OrbitState = 'default' | 'resting' | 'swipe';
  const orbitStateRef = useRef<OrbitState>('default');
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      if (orbitWrapperRef.current) {
        gsap.killTweensOf(orbitWrapperRef.current);
        orbitStateRef.current = 'default';
        gsap.to(orbitWrapperRef.current, {
          transform: 'translate3d(0, 0, 0px) scale(1)',
          duration: 0.85,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
      if (videoContainerRef.current) {
        gsap.killTweensOf(videoContainerRef.current);
        gsap.to(videoContainerRef.current, {
          scale: 1.0,
          duration: 0.85,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
    }, 5000);
  }, []);

  const transitionOrbitState = useCallback((targetState: OrbitState) => {
    if (!orbitWrapperRef.current) return;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    gsap.killTweensOf(orbitWrapperRef.current);
    if (videoContainerRef.current) {
      gsap.killTweensOf(videoContainerRef.current);
    }
    orbitStateRef.current = targetState;

    if (targetState === 'swipe') {
      gsap.to(orbitWrapperRef.current, {
        transform: 'translate3d(0, 0, 72px) scale(1.17)',
        duration: 0.5,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          scale: 1.06,
          duration: 0.5,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
    } else if (targetState === 'resting') {
      gsap.to(orbitWrapperRef.current, {
        transform: 'translate3d(0, 0, 60px) scale(1.15)',
        duration: 0.85,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        onComplete: () => {
          resetIdleTimer();
        },
      });
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          scale: 1.0,
          duration: 0.85,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
      resetIdleTimer();
    } else if (targetState === 'default') {
      gsap.to(orbitWrapperRef.current, {
        transform: 'translate3d(0, 0, 0px) scale(1)',
        duration: 0.85,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          scale: 1.0,
          duration: 0.85,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
    }
  }, [resetIdleTimer]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const [activePortalModal, setActivePortalModal] = useState<Discipline | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Background Video State
  const [isSectionMuted, setIsSectionMuted] = useState(true);
  const sectionVideoRef = useRef<HTMLVideoElement>(null);
  const currentPlaybackRateRef = useRef<number>(1.0);
  const lastVideoAngleRef = useRef<number>(0);

  // Helper to resume auto-rotation immediately when user interaction ends
  const scheduleAutoRotateResume = useCallback(() => {
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
    }
    setIsAutoRotating(true);
  }, []);

  // Sync mute state for background video
  useEffect(() => {
    const video = sectionVideoRef.current;
    if (video) {
      video.muted = isSectionMuted;
    }
  }, [isSectionMuted]);

  // Viewport IntersectionObserver: single source of truth for video play/pause lifecycle
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const videoEl = sectionVideoRef.current;

    if (!sectionEl || !videoEl) return;

    let isSectionIntersecting = false;

    const safePlay = () => {
      if (!videoEl) return;
      videoEl.muted = isSectionMuted;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
            videoEl.muted = true;
            videoEl.play().catch(() => {});
          }
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionIntersecting = entry.isIntersecting;
          if (entry.isIntersecting) {
            safePlay();
          } else {
            videoEl.pause();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const handlePause = () => {
      if (isSectionIntersecting && !document.hidden && videoEl.paused) {
        safePlay();
      }
    };

    const handleStalled = () => {
      if (isSectionIntersecting && !document.hidden && videoEl.paused) {
        safePlay();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isSectionIntersecting && videoEl.paused) {
        safePlay();
      }
    };

    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('stalled', handleStalled);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    observer.observe(sectionEl);

    return () => {
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('stalled', handleStalled);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [isSectionMuted]);

  const hoveredCardIndexRef = useRef<number | null>(null);

  // Equal angular step between all items (2PI / 9)
  const stepAngle = (2 * Math.PI) / totalItems;

  // Main 60 FPS 3D Spherical Orbit & Perspective Render Loop
  const updateOrbit = useCallback(() => {
    if (!isDragging && !activePortalModal) {
      // Always apply momentum coasting when not dragging for effortless swipe
      angleRef.current += velocityRef.current;
      velocityRef.current *= 0.94; // Physical friction damping
      
      if (Math.abs(velocityRef.current) <= 0.00005) {
        velocityRef.current = 0;
      }

      // Add base auto-rotation only if active
      if (isAutoRotating) {
        angleRef.current -= 0.0018;
      }
    }

    // Physical spring lean towards drag direction
    let targetLean = 0;
    if (isDragging) {
      targetLean = Math.max(-16, Math.min(16, velocityRef.current * 320));
    } else if (Math.abs(velocityRef.current) > 0.0001) {
      targetLean = Math.max(-12, Math.min(12, velocityRef.current * 240));
    }
    leanRef.current += (targetLean - leanRef.current) * 0.12;

    const currentAngle = angleRef.current;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;

    // Organic edge breathing cycle (2-3% modulation over ~7s cycle)
    const breathVal = (Math.sin(Date.now() * 0.0009) + 1) / 2;

    // Radius specs for 3D Inclined Orbital Ring (45° tilt down from back) - Fluidly scaled for all screen sizes
    let radiusX = 640;
    let radiusZ = 360;

    if (vw < 480) {
      // Mobile narrow (320px - 480px)
      radiusX = Math.min(145, Math.max(100, vw * 0.35));
      radiusZ = Math.min(100, Math.max(70, vw * 0.22));
    } else if (vw < 640) {
      // Mobile wide (480px - 640px)
      radiusX = Math.min(220, vw * 0.38);
      radiusZ = 150;
    } else if (vw < 1024) {
      // Tablet (640px - 1024px)
      radiusX = Math.min(480, vw * 0.48);
      radiusZ = 260;
    } else if (vw < 1440) {
      radiusX = 580;
      radiusZ = 320;
    } else {
      radiusX = 640;
      radiusZ = 360;
    }

    const tiltSin = 0.7071; // sin(45°)
    const tiltCos = 0.7071; // cos(45°)

    let closestFrontIndex = 0;
    let minFrontDist = Infinity;

    // Render every card attached to the continuous 3D Orbital Ring
    cardsRef.current.forEach((cardEl, i) => {
      if (!cardEl) return;

      const cardAngle = currentAngle + i * stepAngle;
      
      const sinA = Math.sin(cardAngle);
      const cosA = Math.cos(cardAngle);

      // True 3D 45° Tilted Orbital Ring Coordinates (X, Y, Z)
      // When cosA = 1 (front middle focus card), y = 0 (exact vertical center)
      const x = sinA * radiusX;
      const y = -(1 - cosA) * radiusZ * tiltSin * 0.75; 
      const baseZ = cosA * radiusZ * tiltCos;

      // Track frontmost card
      const distFromFront = Math.hypot(sinA, 1 - cosA);
      if (distFromFront < minFrontDist) {
        minFrontDist = distFromFront;
        closestFrontIndex = i;
      }

      // Depth factor along the orbital ring: 1 (front center) down to 0 (far back)
      const frontFactor = Math.max(0, (cosA + 1) / 2);

      // Relative angle from front center (-PI to +PI) & normalized item step offset
      const relAngle = Math.atan2(sinA, cosA);
      const itemOffset = Math.abs(relAngle / stepAngle);

      // Smooth 5-card visibility & fade curve:
      // Exactly 5 cards visible (1 center focus card @ 1.0 opacity, 2 left/right neighbors @ 0.75 & 0.35)
      // Continuous Hermite smoothstep fade-in/fade-out between itemOffset 2.0 and 2.4
      let opacity = 0;
      if (itemOffset <= 1.0) {
        opacity = 1.0 - itemOffset * 0.25; // 1.0 -> 0.75
      } else if (itemOffset <= 2.0) {
        opacity = 0.75 - (itemOffset - 1.0) * 0.40; // 0.75 -> 0.35
      } else if (itemOffset <= 2.4) {
        const fadeProgress = (2.4 - itemOffset) / 0.4; // 1.0 down to 0.0
        const smoothFade = fadeProgress * fadeProgress * (3 - 2 * fadeProgress); // Hermite smoothstep
        opacity = 0.35 * smoothFade;
      } else {
        opacity = 0;
      }

      // Shallow 3D perspective scaling along orbital ring
      const scale = 0.60 + 0.40 * frontFactor;

      // 3D Rotations along orbital ring with dynamic spring lean towards drag direction
      let rotateY = -sinA * 22 + leanRef.current * (0.6 + 0.4 * frontFactor);
      let rotateX = -(1 - cosA) * 18;
      let rotateZ = (leanRef.current * 0.22) * (0.5 + 0.5 * frontFactor);

      // Active Card translateZ & scale boost (Removed extra boost so front card keeps natural orbit size without pop)
      const translateZBoost = 0;
      const activeScaleBoost = 1.0;

      // Video Hover Pop Effect (Smoothly interpolated continuous floating movement)
      if (!cardHoverProgressRef.current[i]) {
        cardHoverProgressRef.current[i] = { progress: 0 };
      }
      const hoverProgress = cardHoverProgressRef.current[i].progress;
      const hoverZBoost = hoverProgress * 16;
      const hoverScaleBoost = 1.0 + hoverProgress * 0.025;

      cardEl.style.setProperty('--hover-p', hoverProgress.toFixed(3));
      cardEl.style.setProperty('--breath', breathVal.toFixed(3));

      const finalScale = scale * hoverScaleBoost * activeScaleBoost;
      const finalZ = baseZ + translateZBoost + hoverZBoost;

      // Occlusion & Layering - Optical Focus & Depth-of-Field (STEP 13 rules)
      const zIndex = Math.round(1 + frontFactor * 100);

      // World-space directional key lighting from fixed top-behind light source (~35° angle)
      // Fixed light position in scene space: X_L = 0, Y_L = -160, Z_L = -240
      const lightY = -160;
      const lightZ = -240;
      const dy = y - lightY;
      const dz = finalZ - lightZ;
      const lightDist = Math.hypot(x * 0.4, dy, dz);
      const keyProximity = Math.max(0, 1 - lightDist / 550);

      // Ambient fill baseline ensures back cards never go completely black (min 58% brightness)
      const ambientFill = 0.58;
      const keyLightContrib = 0.28 * Math.pow(keyProximity, 1.2);
      const frontFocusContrib = 0.14 * frontFactor;
      
      const totalBrightness = Math.round((ambientFill + keyLightContrib + frontFocusContrib) * 100);
      let brightness = Math.min(100, Math.max(55, totalBrightness));

      let blur = 0;
      let saturate = 100;

      if (itemOffset <= 0.2) {
        blur = 0;
        saturate = 100;
      } else if (itemOffset <= 1.0) {
        const t = (itemOffset - 0.2) / 0.8;
        blur = t * 0.4;
        saturate = Math.round(100 - t * 8);
      } else if (itemOffset <= 2.4) {
        const t = Math.min(1.0, (itemOffset - 1.0) / 1.4);
        blur = 0.4 + t * 1.2;
        saturate = Math.round(92 - t * 20);
      } else {
        blur = 1.6;
        saturate = 72;
      }

      // Apply 3D GPU transform & optical depth styling
      cardEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${finalZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${finalScale.toFixed(3)})`;
      cardEl.style.opacity = opacity.toFixed(3);
      cardEl.style.zIndex = zIndex.toString();
      cardEl.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness}%) saturate(${saturate}%)`;
      cardEl.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';
      cardEl.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';

      // Play/Pause Video decoding based on card visibility
      const videoEl = cardVideosRef.current[i];
      if (videoEl) {
        if (opacity > 0.001) {
          if (videoEl.paused) {
            const playPromise = videoEl.play();
            if (playPromise !== undefined) playPromise.catch(() => {});
          }
        } else {
          if (!videoEl.paused) videoEl.pause();
        }
      }

      // Living floating typography motion driven directly inside the 60 FPS updateOrbit animation loop
      const typoEl = typoRefs.current[i];
      if (typoEl) {
        const timeSec = Date.now() * 0.001;
        const phase = i * 1.5;
        // Continuous weightless floating sine wave (~4px vertical float, ~2px horizontal drift)
        const floatY = Math.sin(timeSec * 1.1 + phase) * 4.0;
        const floatX = Math.cos(timeSec * 0.85 + phase * 1.2) * 2.0;
        typoEl.style.transform = `translate3d(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px, 0px)`;
      }

      // Pause unnecessary procedural particle animations on hidden cards
      if (cardEl) {
        const particlesContainer = cardEl.querySelector('.particles-container') as HTMLElement;
        if (particlesContainer) {
          particlesContainer.style.display = opacity <= 0.001 ? 'none' : 'block';
        }
      }
    });

    if (closestFrontIndex !== activeCardIndex && !isDragging && !isSnappingRef.current) {
      setActiveCardIndex(closestFrontIndex);
      triggerReflectionSweep(closestFrontIndex);
    }

    // Hover + Carousel Rotation Sync: Automatically release hover state if card rotates out of visible front area
    if (hoveredCardIndexRef.current !== null) {
      const hIdx = hoveredCardIndexRef.current;
      const hCardAngle = currentAngle + hIdx * stepAngle;
      const hSinA = Math.sin(hCardAngle);
      const hCosA = Math.cos(hCardAngle);
      const hRelAngle = Math.atan2(hSinA, hCosA);
      const hItemOffset = Math.abs(hRelAngle / stepAngle);

      if (hItemOffset > 1.5) {
        hoveredCardIndexRef.current = null;
        setHoveredCardIndex(null);
        setIsHovered(false);
      }
    }

    requestRef.current = requestAnimationFrame(updateOrbit);
  }, [isAutoRotating, isDragging, activePortalModal, totalItems, stepAngle, activeCardIndex]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateOrbit);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateOrbit]);

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  // Rotate smoothly to specific discipline index with cinematic orbital depth push for all cards
  const rotateToDiscipline = (index: number) => {
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    setIsAutoRotating(false);

    isSnappingRef.current = true;
    velocityRef.current = 0;
    dragStartAngleRef.current = angleRef.current;

    const currentAngle = angleRef.current;
    const currentK = Math.round((-currentAngle - index * stepAngle) / (2 * Math.PI));
    const targetAngle = -index * stepAngle - currentK * 2 * Math.PI;

    // Transition to Swipe state on swap, then back to Resting state on complete
    transitionOrbitState('swipe');

    gsap.to(angleRef, {
      current: targetAngle,
      duration: 1.1,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      onComplete: () => {
        isSnappingRef.current = false;
        setActiveCardIndex(index);
        scheduleAutoRotateResume();
        transitionOrbitState('resting');
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
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    setIsAutoRotating(false);

    setIsDragging(true);
    isSnappingRef.current = false;
    gsap.killTweensOf(angleRef);
    velocityRef.current = 0;
    dragStartXRef.current = clientX;
    dragStartAngleRef.current = angleRef.current;

    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();

    // Orbital system transitions to Swipe state on drag start
    transitionOrbitState('swipe');
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartXRef.current;
    // Increase sensitivity to make dragging feel lighter and more effortless
    const sens = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.0045 : 0.0035;
    angleRef.current = dragStartAngleRef.current + deltaX * sens;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 8) {
      const dx = clientX - lastXRef.current;
      velocityRef.current = (dx / dt) * sens * 18; // Increased momentum transfer
      lastXRef.current = clientX;
      lastTimeRef.current = now;
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Smoothly transition Swipe → Resting state on release (starts 5s idle return timer)
    transitionOrbitState('resting');

    scheduleAutoRotateResume();
  };

  const handleOpenPortal = (discipline: Discipline) => {
    setActivePortalModal(discipline);
    onSelectDiscipline(discipline);
  };

  return (
    <section
      ref={sectionRef}
      id="disciplines"
      className="relative w-full min-h-[100svh] flex flex-col justify-center bg-[#000000] text-[#F4F3EF] py-12 lg:py-16 overflow-hidden select-none"
    >
      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16 flex items-center justify-between relative z-10">
          <div>
            <h2 className="font-sans text-h2 font-medium text-[#F4F3EF]">
              Capabilities
            </h2>
          </div>
        </div>

        {/* 3D Orbital Carousel Stage Wrapper */}
        <div className="relative w-full h-[520px] sm:h-[600px] md:h-[660px] flex flex-col justify-between">
          {/* Capabilities Section Background - Video Stream (Aligned to Orbit Center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[160%] min-h-[750px] z-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div
              ref={videoContainerRef}
              className="w-full h-full flex items-center justify-center relative"
            >
              {/* Direct GitHub CDN video stream with fallback */}
              <video
                ref={sectionVideoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover object-center opacity-45 mix-blend-screen filter brightness-[0.90] contrast-[1.10]"
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  console.log('[Capabilities Video loadedmetadata]', { readyState: v.readyState, networkState: v.networkState, paused: v.paused });
                  v.muted = true;
                  v.play().catch((err) => console.log('[Capabilities Video play catch]', err));
                }}
                onLoadedData={(e) => {
                  const v = e.currentTarget;
                  console.log('[Capabilities Video loadeddata]', { readyState: v.readyState, networkState: v.networkState, paused: v.paused, error: v.error });
                }}
                onCanPlay={(e) => {
                  const v = e.currentTarget;
                  console.log('[Capabilities Video canplay]', { readyState: v.readyState, networkState: v.networkState, paused: v.paused, error: v.error });
                  v.play().catch((err) => console.log('[Capabilities Video play catch on canplay]', err));
                }}
                onPlay={(e) => {
                  const v = e.currentTarget;
                  console.log('[Capabilities Video play event]', { readyState: v.readyState, networkState: v.networkState, paused: v.paused });
                }}
                onPause={(e) => {
                  const v = e.currentTarget;
                  console.log('[Capabilities Video pause event]', { readyState: v.readyState, networkState: v.networkState, paused: v.paused });
                }}
                onError={(e) => {
                  const v = e.currentTarget;
                  console.log('[Capabilities Video error event]', { readyState: v.readyState, networkState: v.networkState, paused: v.paused, error: v.error });
                }}
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0;
                  e.currentTarget.play().catch(() => {});
                }}
              >
                <source src="https://files.catbox.moe/8ysmvv.mp4" type="video/mp4" />
                <source src="/videos/capabilities-background.mp4" type="video/mp4" />
                <source src="/capabilities-video.mp4" type="video/mp4" />
                <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-3d-sphere-animation-41487-large.mp4" type="video/mp4" />
              </video>

              {/* Elegant gradient vignettes for high-contrast typography and cards */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-[#000000]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.80)_100%)]" />
            </div>
          </div>
          {/* 3D Orbital Carousel Interactive Stage (Tilted Orbital System) */}
          <div
            ref={containerRef}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              handleStart(e.clientX);
            }}
            onPointerMove={(e) => {
              if (isDragging) {
                handleMove(e.clientX);
              }
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              handleEnd();
            }}
            onPointerCancel={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              handleEnd();
            }}
            className="relative z-10 w-full h-[440px] sm:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing my-auto touch-pan-y"
            style={{ 
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              touchAction: 'pan-y', // Prevents horizontal scroll sticking on mobile
            }}
          >
            {/* Dedicated OrbitWrapper - Receives GSAP camera/orbit transforms */}
            <div
              ref={orbitWrapperRef}
              className="w-full h-full flex items-center justify-center relative"
              style={{ transformStyle: 'preserve-3d' }}
            >

            {DISCIPLINES.map((discipline, idx) => {
              const isFeaturedFront = activeCardIndex === idx;
              const isHoveredTarget = hoveredCardIndex === idx;
              const isCardFocused = hoveredCardIndex !== null ? isHoveredTarget : isFeaturedFront;

              return (
                <div
                  key={discipline.id}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  onMouseEnter={() => {
                    if (hoveredCardIndexRef.current === idx) return;
                    hoveredCardIndexRef.current = idx;
                    setHoveredCardIndex(idx);
                    setIsHovered(true);
                    triggerReflectionSweep(idx);
                    if (!cardHoverProgressRef.current[idx]) {
                      cardHoverProgressRef.current[idx] = { progress: 0 };
                    }
                    gsap.to(cardHoverProgressRef.current[idx], {
                      progress: 1,
                      duration: 0.28,
                      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      overwrite: 'auto',
                    });
                  }}
                  onMouseLeave={() => {
                    if (hoveredCardIndexRef.current === idx) {
                      hoveredCardIndexRef.current = null;
                      setHoveredCardIndex(null);
                      setIsHovered(false);
                    }
                    if (cardHoverProgressRef.current[idx]) {
                      gsap.to(cardHoverProgressRef.current[idx], {
                        progress: 0,
                        duration: 0.45,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        overwrite: 'auto',
                      });
                    }
                  }}
                  onClick={() => {
                    if (isFeaturedFront) {
                      handleOpenPortal(discipline);
                    } else {
                      rotateToDiscipline(idx);
                    }
                  }}
                  className="card-container group absolute top-1/2 left-1/2 w-[220px] xs:w-[260px] sm:w-[310px] md:w-[330px] h-[145px] xs:h-[165px] sm:h-[190px] md:h-[200px] rounded-[20px] sm:rounded-[26px] p-[1.5px] overflow-hidden cursor-pointer select-none border shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    borderColor: 'transparent',
                  }}
                >
                  {/* Optical Edge Lighting System (Dynamic Light Energy Transfer) */}
                  {(() => {
                    const isHoveredTarget = hoveredCardIndex === idx;
                    const isFrontTarget = hoveredCardIndex === null && isFeaturedFront;
                    const beamClass = isHoveredTarget ? 'is-hovered-target' : isFrontTarget ? 'is-active-front' : '';

                    return (
                      <div className="optical-edge-mask rounded-[22px] sm:rounded-[26px]">
                        {/* Idle State: Static subtle edge glow */}
                        <div className="optical-edge-idle" />

                        {/* Unified Dynamic Optical Edge Energy Light Beam */}
                        <div className={`optical-edge-energy-beam ${beamClass}`} />
                      </div>
                    );
                  })()}

                  {/* Laminated Glass Edge Physical Thickness */}
                  <div 
                    className="absolute inset-0 rounded-[22px] sm:rounded-[26px] pointer-events-none z-0 border border-white/[0.12]"
                    style={{
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.35), inset 0 -1px 1.5px rgba(0, 0, 0, 0.45)',
                    }}
                  />

                  {/* Optical Glass Card Body - Clean Premium Frosted Glass Effect */}
                  <div 
                    className="relative w-full h-full rounded-[20px] sm:rounded-[24px] overflow-hidden backdrop-blur-3xl p-5 sm:p-6 flex flex-col justify-center items-center text-center z-10 border"
                    style={{
                      borderColor: 'rgba(230, 240, 255, calc(0.16 + var(--hover-p, 0) * 0.22))',
                      backgroundColor: 'rgba(255, 255, 255, calc(0.04 + var(--hover-p, 0) * 0.02))',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.30), inset 0 -1px 1.5px rgba(0, 0, 0, 0.40), 0 25px 50px rgba(0,0,0,0.70)',
                      transform: 'perspective(1000px) rotateX(calc(var(--hover-p, 0) * 1.2deg)) rotateY(calc(var(--hover-p, 0) * -1.2deg))',
                    }}
                  >
                    {/* Single-Pass Optical Reflection Sweep (250ms light sliding smoothly across polished glass) */}
                    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[20px] sm:rounded-[24px]">
                      <div 
                        className="absolute -inset-full pointer-events-none mix-blend-screen"
                        style={{
                          transform: 'skewX(-26deg) translateX(calc(-100% + var(--sweep-pos, 0) * 300%))',
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.20) 45%, rgba(230, 242, 255, 0.30) 50%, rgba(255, 255, 255, 0.20) 55%, transparent 100%)',
                          opacity: 'var(--sweep-opacity, 0)',
                        }}
                      />
                    </div>

                    {/* Soft Top-Down Key Light Reflection on Glass Surface */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
                      style={{
                        opacity: 'calc(0.12 + var(--hover-p, 0) * 0.10)',
                        background: 'linear-gradient(180deg, rgba(240, 248, 255, 0.16) 0%, rgba(220, 235, 255, 0.02) 45%, transparent 100%)',
                      }}
                    />

                    {/* Fine Sandblasted Matte Grain Texture Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
                      style={{
                        opacity: 'calc(0.20 + var(--hover-p, 0) * 0.08)',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.35'/%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Procedural Atmospheric Particles Inside Glass Card (Tiny stars, floating dust, fine specks & micro-optical particles) */}
                    <div className="particles-container absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
                      {CARD_ATMOSPHERES[idx].particles.map((p) => {
                        const activitySpeedMult = isFeaturedFront ? 0.86 : 1.0;
                        const floatDur = (p.floatDuration * activitySpeedMult).toFixed(2);
                        
                        const pathName = p.isOrbital
                          ? 'particlePathOrbital'
                          : `particlePath${p.pathKeyframe}`;

                        const mainAnim = `${pathName} ${floatDur}s ease-in-out ${p.floatDelay}s infinite`;
                        const twinkleAnim = p.isTwinkler
                          ? `, singleParticleTwinkle ${p.twinkleDuration}s ease-in-out ${p.twinkleDelay}s infinite`
                          : '';

                        const zIndex = p.layer === 'bg' ? 1 : p.layer === 'mid' ? 2 : 3;
                        const blur = p.type === 'soft_haze' ? 'blur(4px)' : p.layer === 'bg' ? 'blur(0.4px)' : p.type === 'floating_dust' ? 'blur(0.3px)' : 'none';

                        return (
                          <div
                            key={p.id}
                            className="absolute rounded-full"
                            style={{
                              left: `${p.x}%`,
                              top: `${p.y}%`,
                              width: `${p.size}px`,
                              height: `${p.size}px`,
                              background: p.type === 'soft_haze' ? `radial-gradient(circle, ${p.color} 0%, transparent 70%)` : p.color,
                              filter: blur,
                              boxShadow: p.type === 'tiny_star' && p.size > 1.1 ? '0 0 2px rgba(235, 245, 255, 0.7)' : 'none',
                              zIndex,
                              opacity: p.baseOpacity,
                              animation: `${mainAnim}${twinkleAnim}`,
                              '--base-op': p.baseOpacity,
                              '--orbit-rx': `${p.orbitRx}px`,
                              '--orbit-ry': `${p.orbitRy}px`,
                              '--orbit-angle': `${p.orbitAngle}deg`,
                            } as React.CSSProperties}
                          />
                        );
                      })}
                    </div>

                    {/* Continuous Card Video / Image Media inside Glass - NEVER pauses or stops on hover */}
                    {discipline.bgVideoUrl ? (
                      <video
                        ref={(el) => { cardVideosRef.current[idx] = el; }}
                        src={discipline.bgVideoUrl}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{
                          filter: 'brightness(calc(0.93 + var(--hover-p, 0) * 0.07)) contrast(1.05)',
                          opacity: 'calc(0.93 + var(--hover-p, 0) * 0.07)',
                        }}
                      />
                    ) : discipline.previewImage ? (
                      <img
                        src={discipline.previewImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{
                          filter: 'brightness(calc(0.93 + var(--hover-p, 0) * 0.07)) contrast(1.05)',
                          opacity: 'calc(0.93 + var(--hover-p, 0) * 0.07)',
                        }}
                      />
                    ) : null}

                    {/* Typography ONLY — Pure, Clean Display & Centered Kinetic Emergence */}
                    <div 
                      ref={(el) => { typoRefs.current[idx] = el; }}
                      className="relative z-20 w-full max-w-[92%] mx-auto flex flex-col items-center justify-center text-center pointer-events-none"
                    >
                      {/* Main Heading — Weightless float with premium chromatic leak behind */}
                      <div className="relative">
                        {/* Chromatic Leak Cyan */}
                        <h3 
                          className="absolute inset-0 font-sans text-xl sm:text-2xl font-medium text-transparent leading-[1.05] tracking-tight text-center pointer-events-none animate-chromatic-cyan"
                          style={{ 
                            WebkitTextStroke: '1px rgba(0, 240, 255, 0.4)',
                            animationDelay: `-${(idx * 1.5) % 8.5}s` 
                          }}
                          aria-hidden="true"
                        >
                          {discipline.name}
                        </h3>
                        {/* Chromatic Leak Magenta */}
                        <h3 
                          className="absolute inset-0 font-sans text-xl sm:text-2xl font-medium text-transparent leading-[1.05] tracking-tight text-center pointer-events-none animate-chromatic-magenta"
                          style={{ 
                            WebkitTextStroke: '1px rgba(255, 0, 90, 0.4)',
                            animationDelay: `-${(idx * 1.5) % 8.5}s` 
                          }}
                          aria-hidden="true"
                        >
                          {discipline.name}
                        </h3>
                        {/* Main Text (Perfectly clean) */}
                        <h3 
                          className={`relative z-10 font-sans text-xl sm:text-2xl font-medium text-white leading-[1.05] tracking-tight text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isCardFocused 
                              ? '-translate-y-1 drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)]' 
                              : 'translate-y-0 drop-shadow-sm group-hover:-translate-y-1 group-hover:drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)]'
                          }`}
                        >
                          {discipline.name}
                        </h3>
                      </div>

                      {/* Supporting Subheading — Visible preview with soft glass fade starting mid-first-line */}
                      <div 
                        className="w-full flex justify-center mt-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          WebkitMaskImage: isCardFocused 
                            ? 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)' 
                            : 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
                          maskImage: isCardFocused 
                            ? 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)' 
                            : 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
                        }}
                      >
                        <p className={`font-sans text-[11px] sm:text-xs text-neutral-200/90 leading-relaxed font-light text-center max-w-[260px] line-clamp-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isCardFocused
                            ? 'opacity-100 translate-y-0 blur-0'
                            : 'opacity-80 translate-y-1 blur-[0.3px] group-hover:opacity-100 group-hover:translate-y-0 group-hover:blur-0'
                        }`}>
                          {discipline.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN CINEMATIC PORTAL PAGE MODAL                    */}
      {/* ========================================================= */}
      {activePortalModal && (
        <div className="fixed inset-0 z-50 bg-[#000000] text-[#F4F3EF] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
          
          {/* Ambient Video Background */}
          <div className="fixed inset-0 z-0 bg-[#000000] pointer-events-none">
            {activePortalModal.bgVideoUrl && (
              <video
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover filter brightness-50 contrast-110 scale-105"
                src={activePortalModal.bgVideoUrl}
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

              <h1 className="font-sans text-display font-medium text-[#F4F3EF]">
                {activePortalModal.name}
              </h1>

              {activePortalModal.portalWorldQuote && (
                <blockquote className="font-sans text-h3 font-medium text-[#C9C2B4] border-l-2 border-[#3b82f6] pl-6 py-2">
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
                  className="bg-[#F4F3EF] text-[#0A0A0B] px-8 py-4 rounded-lg text-xs font-mono uppercase tracking-widest font-bold hover:bg-[#C9C2B4] transition-all flex items-center gap-2 shadow-2xl active:scale-95"
                >
                  <span>Explore Featured Works</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  onClick={() => setActivePortalModal(null)}
                  className="bg-[#0A0A0B]/80 text-[#F4F3EF] border border-[#232326] px-8 py-4 rounded-lg text-xs font-mono uppercase tracking-widest hover:border-[#C9C2B4] transition-all active:scale-95"
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

