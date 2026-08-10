import React, { useEffect, useRef, useState } from 'react';

interface HeroStageProps {
  onOpenInquiry?: () => void;
}

export const HeroStage: React.FC<HeroStageProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isScrubbingActiveRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const [videoSrcIndex, setVideoSrcIndex] = useState(0);
  const videoSources = [
    'https://files.catbox.moe/04koic.mp4',
    '/videos/hero-background.mp4',
    '/hero-video.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-line-lights-in-darkness-41548-large.mp4',
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle video loading errors gracefully by switching to CDN fallback source
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElem = e.currentTarget;
    if (!videoElem.error || videoElem.error.code === 1) {
      return;
    }
    if (videoSrcIndex < videoSources.length - 1) {
      setVideoSrcIndex((prev) => prev + 1);
    }
  };

  // Ensure video attempts autoplay on mount when user is at top of page and explicitly muted
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [videoSrcIndex]);

  // Scroll listener with requestAnimationFrame throttling for scroll video scrubbing
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalScrollable = containerRef.current.offsetHeight - viewportH;
      if (totalScrollable <= 0) return;

      // Compute progress clamped between 0 and 1
      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      setScrollProgress(progress);

      const video = videoRef.current;
      if (video) {
        video.muted = true;

        const isReady =
          video.readyState >= 2 &&
          video.seekable &&
          video.seekable.length > 0 &&
          !isNaN(video.duration) &&
          video.duration > 0;

        if (isReady) {
          if (progress > 0.005) {
            if (!isScrubbingActiveRef.current) {
              isScrubbingActiveRef.current = true;
              video.pause();
            }
            const targetTime = progress * video.duration;
            if (Math.abs(video.currentTime - targetTime) > 0.04) {
              video.currentTime = targetTime;
            }
          } else {
            if (isScrubbingActiveRef.current || video.paused) {
              isScrubbingActiveRef.current = false;
              video.play().catch(() => {});
            }
          }
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        rafIdRef.current = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 16,
      y: (clientY / innerHeight - 0.5) * 16,
    });
  };

  // Layer opacities based on scroll progress
  const heroOpacity = Math.max(0, 1 - scrollProgress * 2.2);
  const introOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.70) * 3.8));

  // Subtle depth parallax movement relative to scroll
  const textParallaxY = scrollProgress * -40;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[320vh] w-full"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#000000] flex items-center justify-center">
        
        {/* Background Cosmic Video with Optical Vignette Overlay */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] scale-105"
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0) scale(1.05)`
          }}
        >
          <video
            ref={videoRef}
            key={videoSources[videoSrcIndex]}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            src={videoSources[videoSrcIndex]}
            className="w-full h-full object-cover opacity-85 filter brightness-105 contrast-110"
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
          />
          
          {/* Subtle gradient vignette to maintain contrast behind typography without darkening center video */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 via-[#000000]/15 to-transparent pointer-events-none" />
        </div>

        {/* Hero bottom edge soft black blend moving UPWARD 24px into the video */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[24px] bg-gradient-to-t from-[#000000] via-[#000000]/80 via-40% to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />

        {/* Ambient Subtle Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: `radial-gradient(circle 800px at ${45 + mousePos.x * 0.4}% ${50 + mousePos.y * 0.4}%, rgba(201, 194, 180, 0.15), transparent 75%)`
          }}
        />

        {/* Layer 1: Main Hero Title (Optically Positioned for Visual Balance with F1 Subject) */}
        <div
          className="absolute inset-0 w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-24 flex flex-col justify-center items-start transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none z-10"
          style={{ 
            opacity: heroOpacity,
            transform: `translate3d(${mousePos.x * 0.15}px, ${mousePos.y * 0.15 + textParallaxY}px, 0)`
          }}
        >
          <h1 className="font-sans font-medium text-display text-[#F4F3EF] mb-4 sm:mb-6 drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)] max-w-4xl tracking-[-0.03em] leading-[0.92]">
            The <span className="font-medium bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#E879F9] text-transparent bg-clip-text opacity-90">Imagination</span>
            <br />
            Studio
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-[9.5px] sm:text-label text-[#8B8B8D] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] tracking-wider sm:tracking-[0.15em]">
            <span>BRAND</span>
            <span className="text-[#C9C2B4]/60">•</span>
            <span>AUTOMOTIVE</span>
            <span className="text-[#C9C2B4]/60">•</span>
            <span>3D CG</span>
            <span className="text-[#C9C2B4]/60">•</span>
            <span>MOTION &amp; VFX</span>
          </div>
        </div>

        {/* Layer 2: Intro Vision Statement (Fades in subtly around 7-7.5s in the upper-third area above orbit midpoint) */}
        <div
          className="absolute inset-0 w-full max-w-4xl mx-auto px-4 sm:px-12 lg:px-24 flex flex-col justify-start pt-20 sm:pt-28 lg:pt-36 items-center text-center transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none z-10"
          style={{ 
            opacity: introOpacity,
            transform: `translate3d(0, ${textParallaxY * 0.3}px, 0)`
          }}
        >
          <div className="max-w-3xl text-center">
            <p className="font-sans font-medium text-h3 text-[#F4F3EF] drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)] leading-[1.12]">
              We don't make graphics.{' '}
              <span className="text-[#8B8B8D]">
                We build complete visual experiences —
              </span>{' '}
              where brand, motion, and story move as one,{' '}
              <span className="text-[#8B8B8D]">
                for clients who mistake nothing for ordinary.
              </span>
            </p>
          </div>
        </div>

        {/* Quiet Minimal Scroll Progress Scrub Bar */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 z-20 pointer-events-none flex items-center justify-between opacity-60">
          <div className="w-full max-w-xs h-[2px] bg-[#232326] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9C2B4] transition-all duration-100"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
