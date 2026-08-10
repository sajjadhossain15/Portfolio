import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../data/studioData';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { CornerDownRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkSectionProps {
  onOpenInquiry: () => void;
}

const ProjectVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (err) {
        // ignore
      }
    };
    
    playVideo();
    
    const handlePause = () => {
      playVideo();
    };
    
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('pause', handlePause);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="project-video w-full h-full object-cover group-hover:scale-105 group-[.is-active-card]:scale-105 transition-transform duration-1000 ease-out filter brightness-[0.85] contrast-[1.10] group-hover:brightness-100 group-[.is-active-card]:brightness-100 transform-gpu pointer-events-none"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  );
};

export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({ onOpenInquiry }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  const activeCardIndexRef = useRef<number>(0);

  const categories = ['All', 'Automotive', 'Branding', '3D & VFX', 'Motion', 'UI/UX'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  const updateActiveCardClass = (activeIndex: number) => {
    const cards = gsap.utils.toArray('.work-card-wrapper') as HTMLElement[];
    cards.forEach((card, i) => {
      if (i === activeIndex) {
        card.classList.add('is-active-card');
        gsap.set(card, { zIndex: 100 });
      } else {
        card.classList.remove('is-active-card');
        gsap.set(card, { zIndex: cards.length - i });
      }
    });
  };

  // Sync hoveredIndex state to ref and update classes
  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
    updateActiveCardClass(hoveredIndex !== null ? hoveredIndex : activeCardIndexRef.current);
  }, [hoveredIndex]);

  // Ensure video continues playing seamlessly and doesn't stall/freeze
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isVideoVisible = false;

    // Force play if stalled, but only if it's supposed to be visible
    const handleStalled = () => {
      if (isVideoVisible) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('stalled', handleStalled);
    video.addEventListener('waiting', handleStalled);
    video.addEventListener('suspend', handleStalled);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVideoVisible = entry.isIntersecting;
          if (isVideoVisible) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('waiting', handleStalled);
      video.removeEventListener('suspend', handleStalled);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = gsap.utils.toArray('.work-card-wrapper') as HTMLElement[];
    if (cards.length === 0) return;

    // Reset any previous GSAP styles
    gsap.set(cards, { clearProps: 'all' });

    // Set perspective on the container
    gsap.set(containerRef.current, { perspective: 2000, transformStyle: 'preserve-3d' });

    // Ensure we start with correct z-indexes (front cards have higher z-index)
    cards.forEach((card, i) => {
      gsap.set(card, { 
        zIndex: cards.length - i,
        transformStyle: 'preserve-3d',
        position: 'absolute',
        top: '50%',
        yPercent: -50,
        left: '50%',
        xPercent: -50,
        width: '90%',
        maxWidth: '1050px',
      });
    });

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    const zStep = isMobile ? -140 : isTablet ? -180 : -250;
    const yStep = isMobile ? -36 : isTablet ? -50 : -70;
    const scaleFactor = isMobile ? 0.04 : 0.07;

    // Initial state for all cards
    cards.forEach((card, i) => {
      if (i === 0) {
        card.classList.add('is-active-card');
      } else {
        card.classList.remove('is-active-card');
      }
      
      const step = i;
      gsap.set(card, { 
        z: zStep * step, 
        scale: 1 - (step * scaleFactor), 
        y: yStep * step, 
        opacity: 1 - (step * 0.1)
      });
    });

    const calculateActiveCardIndex = () => {
      const container = containerRef.current;
      if (!container || cards.length === 0) return 0;

      const containerRect = container.getBoundingClientRect();
      const containerCenterY = containerRect.top + containerRect.height / 2;

      let activeIdx = cards.length - 1;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const cardHeight = cardRect.height || 400;
        
        // When focused card moves down and its center leaves the focus area,
        // focus immediately transfers to the next card behind it.
        const focusThreshold = cardHeight * 0.25;

        if (cardCenterY <= containerCenterY + focusThreshold) {
          activeIdx = i;
          break;
        }
      }
      return activeIdx;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'center center',
        end: `+=${cards.length * 80}%`,
        pin: true,
        scrub: 1,
        onUpdate: () => {
          const scrollActiveIdx = calculateActiveCardIndex();
          activeCardIndexRef.current = scrollActiveIdx;

          if (hoveredIndexRef.current === null) {
            updateActiveCardClass(scrollActiveIdx);
          }
        }
      }
    });

    // Animate each card
    cards.forEach((card, i) => {
      // If it's not the last card, animate it out
      if (i < cards.length) {
        // The current card falls out to the bottom
        tl.to(card, {
          y: '80vh',
          z: 150,
          scale: 1.1,
          opacity: 0,
          rotationX: -8,
          duration: 0.8,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }, i); // Start at time i
      }

      // Animate all subsequent cards moving forward
      for (let j = i + 1; j < cards.length; j++) {
        const nextCard = cards[j];
        const step = j - (i + 1); // How many steps back this card will be after moving
        
        tl.to(nextCard, {
          z: zStep * step,
          scale: 1 - (step * scaleFactor),
          y: yStep * step,
          opacity: 1 - (step * 0.1),
          duration: 0.8,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }, i); // Start concurrently at time i
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [filteredProjects]);

  return (
    <section id="work" className="relative w-full min-h-[100svh] flex flex-col justify-center bg-[#000000] overflow-clip mt-[50px]">
      {/* Background Video Stream */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="sticky top-0 w-full h-[100svh] pointer-events-none">
          <video
            ref={videoRef}
            src="https://files.catbox.moe/7shjhd.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center opacity-45 mix-blend-screen filter brightness-[0.90] contrast-[1.10] pointer-events-none"
          />
          {/* Elegant gradient vignettes */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#000000]/40 to-[#000000] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
        </div>
      </div>
      <div className="py-12 lg:py-16 relative z-10 my-auto">
        <div className="site-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-6">
          <div>
            <h2 className="font-sans text-h2 font-medium text-[#F4F3EF]">
              Selected Work
            </h2>
          </div>
        </div>

        {/* Projects Stack Container */}
        <div 
          ref={containerRef} 
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative w-full h-[80vh] flex items-center justify-center"
        >
          {filteredProjects.map((project, idx) => {
            return (
              <div
                key={project.id}
                className="work-card-wrapper w-full group pointer-events-auto group-[.is-active-card]:!z-[100]"
                style={{ zIndex: filteredProjects.length - idx }}
              >
                {/* Active Card Backlight - Soft atmospheric halo behind the glass card */}
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-[#6C5CE7]/20 via-[#4834D4]/20 to-[#6C5CE7]/20 blur-[40px] opacity-0 group-[.is-active-card]:opacity-100 group-hover:!opacity-100 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10 pointer-events-none rounded-[3rem]" />
                
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredIndex(idx);
                    setSelectedProject(project);
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex((prev) => (prev === idx ? null : prev))}
                  onPointerEnter={() => setHoveredIndex(idx)}
                  className="work-card cursor-pointer bg-[#121214] border border-[#232326] group-[.is-active-card]:border-[#C9C2B4]/30 group-hover:!border-[#C9C2B4]/50 rounded-[20px] sm:rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu w-full overflow-hidden relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/9] pointer-events-auto"
                >
                  {/* Visual Media Full Card Background */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    {project.videoUrl ? (
                      <ProjectVideo src={project.videoUrl} />
                    ) : (
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 group-[.is-active-card]:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] filter brightness-[0.85] contrast-[1.10] group-hover:brightness-100 group-[.is-active-card]:brightness-100 pointer-events-none"
                      />
                    )}
                    {/* Subtle Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/20 to-transparent opacity-90 group-hover:opacity-70 group-[.is-active-card]:opacity-70 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  {/* Card Information - Minimal Hierarchy */}
                  <div className="absolute inset-0 z-10 p-5 sm:p-8 md:p-10 flex flex-col justify-end pointer-events-none">
                    <div className="flex flex-col gap-1.5 sm:gap-2 max-w-2xl transform transition-transform duration-500 group-hover:-translate-y-2 group-[.is-active-card]:-translate-y-2 pointer-events-none">
                      <span className="font-mono text-[10px] sm:text-label text-[#C9C2B4] font-medium drop-shadow-md pointer-events-none">
                        {project.category}
                      </span>
                      <h3 className="font-sans text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-medium text-[#F4F3EF] leading-[1.05] drop-shadow-xl pointer-events-none">
                        {project.title.split('—')[0].trim()}
                      </h3>
                    </div>
                    
                    {/* Explore Interaction */}
                    <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 flex items-center justify-between opacity-100 sm:opacity-0 group-hover:opacity-100 group-[.is-active-card]:opacity-100 transition-all duration-500 transform sm:translate-y-4 group-hover:translate-y-0 group-[.is-active-card]:translate-y-0 pointer-events-none">
                      <div className="glass-control-subtle relative flex items-center gap-2.5 sm:gap-3 w-fit px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-[#3A335C]/40 group-hover:border-[#6C5CE7]/50 group-[.is-active-card]:border-[#6C5CE7]/50 shadow-[inset_0_0_12px_rgba(108,92,231,0.05),0_0_15px_rgba(108,92,231,0.1)] group-hover:shadow-[inset_0_0_15px_rgba(108,92,231,0.15),0_0_20px_rgba(108,92,231,0.2)] group-[.is-active-card]:shadow-[inset_0_0_15px_rgba(108,92,231,0.15),0_0_20px_rgba(108,92,231,0.2)] pointer-events-none">
                        {/* Subtle light sweep */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6C5CE7]/15 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] group-[.is-active-card]:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                        
                        <span className="relative z-10 text-[10px] sm:text-xs uppercase tracking-widest text-[#F4F3EF] font-semibold drop-shadow-md pointer-events-none">Explore</span>
                        <CornerDownRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4F3EF] transform transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-[.is-active-card]:translate-x-0.5 group-[.is-active-card]:translate-y-0.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      </div>
      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenInquiry={onOpenInquiry}
        />
      )}
    </section>
  );
};
