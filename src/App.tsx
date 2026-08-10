import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { HeroStage } from './components/HeroStage';
import { AboutSection } from './components/AboutSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { FeaturedWorkSection } from './components/FeaturedWorkSection';
import { PrinciplesSection } from './components/PrinciplesSection';
import { ContactSection } from './components/ContactSection';
import { InquiryModal } from './components/InquiryModal';
import { FrostedGlassCursor } from './components/FrostedGlassCursor';
import { DirectionalGuidance } from './components/DirectionalGuidance';
import { Discipline } from './types';

export default function App() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    // Initialize premium natural smooth scroll experience
    const lenis = new Lenis({
      lerp: 0.08, // Smooth, natural momentum
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    let settleTimeout: ReturnType<typeof setTimeout> | null = null;
    let isSettling = false;
    let isUserInteracting = false;

    const cancelSettlement = () => {
      if (settleTimeout) {
        clearTimeout(settleTimeout);
        settleTimeout = null;
      }
      if (isSettling) {
        isSettling = false;
      }
    };

    const handleInteractionStart = () => {
      isUserInteracting = true;
      cancelSettlement();
    };

    const handleInteractionEnd = () => {
      isUserInteracting = false;
    };

    window.addEventListener('wheel', handleInteractionStart, { passive: true });
    window.addEventListener('touchstart', handleInteractionStart, { passive: true });
    window.addEventListener('touchmove', handleInteractionStart, { passive: true });
    window.addEventListener('touchend', handleInteractionEnd, { passive: true });
    window.addEventListener('pointerdown', handleInteractionStart, { passive: true });
    window.addEventListener('pointerup', handleInteractionEnd, { passive: true });
    window.addEventListener('keydown', handleInteractionStart, { passive: true });
    window.addEventListener('keyup', handleInteractionEnd, { passive: true });

    const settleToDominantSection = () => {
      if (isUserInteracting) return;

      const viewportHeight = window.innerHeight;
      const sections = Array.from(document.querySelectorAll('section, [data-snap-section]')) as HTMLElement[];
      if (sections.length === 0) return;

      // Top of page gentle settlement
      if (window.scrollY < 80) {
        if (window.scrollY > 2 && window.scrollY < 80) {
          isSettling = true;
          lenis.scrollTo(0, {
            duration: 1.8,
            easing: (t: number) => 1 - Math.pow(1 - t, 4), // Smooth ease-out momentum
            force: false,
            lock: false,
            onComplete: () => { isSettling = false; }
          });
        }
        return;
      }

      // Identify section occupying the largest visible area in the viewport
      let bestTarget: HTMLElement | null = null;
      let maxVisibleHeight = 0;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          bestTarget = section;
        }
      });

      if (!bestTarget) return;

      const targetRect = (bestTarget as HTMLElement).getBoundingClientRect();
      const offsetTop = targetRect.top;

      // Gently settle toward that section if section top is within 40% of viewport and not already aligned
      if (Math.abs(offsetTop) > 3 && Math.abs(offsetTop) < viewportHeight * 0.42) {
        isSettling = true;
        lenis.scrollTo(bestTarget, {
          duration: 1.8, // Natural momentum deceleration
          easing: (t: number) => 1 - Math.pow(1 - t, 4), // Smooth organic curve
          force: false,
          lock: false,
          onComplete: () => {
            isSettling = false;
          }
        });
      }
    };

    lenis.on('scroll', (e: any) => {
      // While actively scrolling, never interrupt or force snap
      if (Math.abs(e.velocity) > 0.05) {
        cancelSettlement();
      }

      // Only after scrolling stops completely and user releases input, schedule gentle settlement
      if (Math.abs(e.velocity) <= 0.05 && !isUserInteracting && !isSettling) {
        if (!settleTimeout) {
          settleTimeout = setTimeout(() => {
            settleToDominantSection();
          }, 350);
        }
      }
    });

    // Integrated RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      cancelSettlement();
      window.removeEventListener('wheel', handleInteractionStart);
      window.removeEventListener('touchstart', handleInteractionStart);
      window.removeEventListener('touchmove', handleInteractionStart);
      window.removeEventListener('touchend', handleInteractionEnd);
      window.removeEventListener('pointerdown', handleInteractionStart);
      window.removeEventListener('pointerup', handleInteractionEnd);
      window.removeEventListener('keydown', handleInteractionStart);
      window.removeEventListener('keyup', handleInteractionEnd);
      lenis.destroy();
    };
  }, []);

  const handleSelectDiscipline = (discipline: Discipline) => {
    // Smooth scroll down to work section or handle filtering
    const workElem = document.getElementById('work');
    if (workElem) {
      workElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F3EF] relative selection:bg-[#C9C2B4] selection:text-[#0A0A0B]">
      {/* Custom Frosted Glass Cursor Lens */}
      <FrostedGlassCursor />

      {/* Persistent Directional Guidance System */}
      <DirectionalGuidance />
      
      {/* Floating Navigation Bar */}
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Main Content Sections */}
      <main>
        {/* Scroll-scrubbed Hero Stage */}
        <HeroStage onOpenInquiry={() => setInquiryModalOpen(true)} />

        {/* About Section Layout */}
        <AboutSection />

        {/* Disciplines / Capabilities */}
        <DisciplinesSection onSelectDiscipline={handleSelectDiscipline} />

        {/* Selected Work Portfolio Showcase */}
        <FeaturedWorkSection onOpenInquiry={() => setInquiryModalOpen(true)} />

        {/* Principles & Manifesto */}
        <PrinciplesSection />

        {/* Contact & Footer */}
        <ContactSection onOpenInquiry={() => setInquiryModalOpen(true)} />
      </main>

      {/* Interactive Project Inquiry Builder Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

    </div>
  );
}
