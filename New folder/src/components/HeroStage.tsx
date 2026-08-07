import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroStageProps {
  onOpenInquiry: () => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({ onOpenInquiry }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isScrubbingActiveRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const [videoSrcIndex, setVideoSrcIndex] = useState(0);
  const videoSources = [
    '/hero-video.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-line-lights-in-darkness-41548-large.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle video loading errors gracefully by switching to CDN fallback source
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElem = e.currentTarget;
    // Ignore abort errors caused by scroll scrubbing or rapid seeking
    if (videoElem.error && videoElem.error.code === 1) {
      return;
    }
    if (videoSrcIndex < videoSources.length - 1) {
      console.warn(`Hero video load error on source ${videoSources[videoSrcIndex]}. Switching to fallback.`);
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
        // Keep video muted during scroll
        video.muted = true;

        // Check if video is ready to seek before setting currentTime
        const isReady =
          video.readyState >= 2 &&
          video.seekable &&
          video.seekable.length > 0 &&
          !isNaN(video.duration) &&
          video.duration > 0;

        if (isReady) {
          if (progress > 0.005) {
            // User is scrolling: pause video & drive currentTime by scroll
            if (!isScrubbingActiveRef.current) {
              isScrubbingActiveRef.current = true;
              video.pause();
            }
            const targetTime = progress * video.duration;
            if (Math.abs(video.currentTime - targetTime) > 0.04) {
              video.currentTime = targetTime;
            }
          } else {
            // User is at the top: resume autoplay loop so it plays continuously
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
    // Initial calculation
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
      // Ensure video starts playing automatically on load when at top
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  // Layer opacities based on scroll progress
  const heroOpacity = Math.max(0, 1 - scrollProgress * 2.2);
  const introOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.3) * 2.2));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[320vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0A0A0B] flex items-center justify-center">
        
        {/* Background Cosmic Video with Gradient Overlay */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out scale-105"
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
          
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/70 via-[#0A0A0B]/20 to-[#0A0A0B]" />
        </div>

        {/* Ambient Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 transition-all duration-700"
          style={{
            background: `radial-gradient(circle 700px at ${50 + mousePos.x * 0.5}% ${50 + mousePos.y * 0.5}%, rgba(201, 194, 180, 0.18), transparent 80%)`
          }}
        />

        {/* Layer 1: Main Hero Title */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: heroOpacity }}
        >
          <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#8B8B8D] mb-6 border border-[#232326] px-4 py-1.5 rounded-full bg-[#141416]/60 backdrop-blur-md">
            Creative Studio — Est. Bangladesh
          </span>

          <h1 className="font-serif-custom font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.95] max-w-6xl text-[#F4F3EF] mb-8 drop-shadow-2xl">
            The <em className="italic font-light text-[#C9C2B4] font-serif-custom">Imagination</em>
            <br />
            Studio
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm tracking-[0.2em] uppercase text-[#8B8B8D]">
            <span>Brand</span>
            <span className="text-[#C9C2B4]">•</span>
            <span>Automotive</span>
            <span className="text-[#C9C2B4]">•</span>
            <span>3D CGI</span>
            <span className="text-[#C9C2B4]">•</span>
            <span>Motion &amp; VFX</span>
          </div>

          <div className="mt-10 pointer-events-auto">
            <button
              onClick={onOpenInquiry}
              className="liquid-glass border border-[#C9C2B4]/30 hover:border-[#C9C2B4] text-[#F4F3EF] px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-[#C9C2B4] group-hover:rotate-12 transition-transform" />
              <span>Commission A Project</span>
            </button>
          </div>
        </div>

        {/* Layer 2: Intro Vision Statement (fades in on scroll, positioned in upper third with compact font size) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-start pt-28 sm:pt-36 md:pt-40 text-center px-6 sm:px-12 md:px-20 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: introOpacity }}
        >
          <div className="max-w-3xl text-center">
            <p className="font-serif-custom font-light text-base sm:text-xl md:text-2xl lg:text-3xl leading-[1.4] text-[#F4F3EF] drop-shadow-lg">
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

        {/* Bottom Progress Scrub Bar */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-full max-w-xl h-1 bg-[#232326] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B8B8D] via-[#C9C2B4] to-[#F4F3EF] transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>

          <div 
            className="flex items-center gap-2 text-[#8B8B8D] transition-opacity duration-300"
            style={{ opacity: Math.max(0, 0.8 - scrollProgress * 2) }}
          >
            <span className="text-[9px] uppercase tracking-[0.25em]">Scroll to scrub video timeline</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#C9C2B4] animate-bounce" />
          </div>
        </div>

      </div>
    </div>
  );
};
