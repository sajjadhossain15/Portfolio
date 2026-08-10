import React, { useRef, useEffect, useState } from 'react';

export const AboutSection: React.FC = () => {
  const VIDEO_URL = "https://files.catbox.moe/4bj7yl.mp4";
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const isCrossfadingRef = useRef(false);

  useEffect(() => {
    if (videoRefA.current) {
      videoRefA.current.muted = true;
      videoRefA.current.play().catch(() => {});
    }
    if (videoRefB.current) {
      videoRefB.current.muted = true;
    }
  }, []);

  const handleTimeUpdate = (index: 0 | 1) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration || isCrossfadingRef.current || activeVideo !== index) return;

    const timeRemaining = video.duration - video.currentTime;
    // Trigger crossfade 0.5s before video ends for a smooth loop transition
    if (timeRemaining <= 0.5) {
      isCrossfadingRef.current = true;
      const nextIndex = index === 0 ? 1 : 0;
      const nextVideo = nextIndex === 0 ? videoRefA.current : videoRefB.current;

      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.muted = true;
        nextVideo.play().then(() => {
          setActiveVideo(nextIndex);
          setTimeout(() => {
            isCrossfadingRef.current = false;
          }, 600);
        }).catch(() => {
          isCrossfadingRef.current = false;
        });
      }
    }
  };

  const handleEnded = (index: 0 | 1) => () => {
    if (activeVideo === index) {
      const nextIndex = index === 0 ? 1 : 0;
      const nextVideo = nextIndex === 0 ? videoRefA.current : videoRefB.current;
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.muted = true;
        nextVideo.play().catch(() => {});
        setActiveVideo(nextIndex);
      }
    }
  };

  return (
    <section 
      id="about" 
      className="relative w-full min-h-[100svh] flex flex-col justify-center bg-[#000000] text-[#F4F3EF] py-12 sm:py-16 lg:py-24 overflow-hidden mt-[20px] sm:mt-[50px] pt-[64px] sm:pt-[96px] ml-0"
    >
      {/* Background Glass Card Container wrapping the Portrait Video with Dual-Layer Crossfade & Uniform 74% Scale */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#000000] flex items-center justify-center">
        <div className="glass-card-medium border border-[#232326] rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] relative w-full h-full scale-[0.74] origin-center flex items-center justify-center overflow-hidden">
          <video
            ref={videoRefA}
            src={VIDEO_URL}
            onTimeUpdate={handleTimeUpdate(0)}
            onEnded={handleEnded(0)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
              activeVideo === 0 ? 'opacity-90' : 'opacity-0'
            }`}
            autoPlay
            muted
            playsInline
            preload="auto"
          />
          <video
            ref={videoRefB}
            src={VIDEO_URL}
            onTimeUpdate={handleTimeUpdate(1)}
            onEnded={handleEnded(1)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
              activeVideo === 1 ? 'opacity-90' : 'opacity-0'
            }`}
            muted
            playsInline
            preload="auto"
          />

          {/* Very subtle 15% dark overlay for subtle text readability while keeping background video fully visible */}
          <div 
            className="absolute inset-0 bg-[#000000]/15" 
            aria-hidden="true"
          />

          {/* Subtle top-edge black blend strictly within 24px of top edge */}
          <div 
            className="absolute top-0 left-0 right-0 h-[24px] bg-gradient-to-b from-[#000000]/40 to-transparent pointer-events-none z-10" 
            aria-hidden="true"
          />

          {/* Subtle bottom-edge black blend strictly within 24px of bottom edge */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[24px] bg-gradient-to-t from-[#000000]/40 to-transparent pointer-events-none z-10" 
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="site-container relative z-10">
        <div className="max-w-xl sm:max-w-2xl flex flex-col justify-center text-left">
          
          {/* Compact, visually controlled 2-line heading */}
          <h2 className="font-sans text-h2 font-medium text-[#F4F3EF] max-w-xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            I TURN IDEAS INTO{' '}
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#E879F9] text-transparent bg-clip-text opacity-90 block sm:inline">
              VISUAL EXPERIENCES.
            </span>
          </h2>

          {/* Secondary supporting paragraph with restrained width and size */}
          <p className="mt-4 sm:mt-5 font-sans text-sm sm:text-base text-[#C9C2B4]/85 max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed font-normal">
            I’m Sajjad Hossain, a Multimedia &amp; Graphic Designer focused on turning ideas, stories and ambitious concepts into visual experiences through design, motion, 3D and digital experiences.
          </p>

        </div>
      </div>
    </section>
  );
};

