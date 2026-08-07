import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroStage } from './components/HeroStage';
import { DisciplinesSection } from './components/DisciplinesSection';
import { FeaturedWorkSection } from './components/FeaturedWorkSection';
import { PrinciplesSection } from './components/PrinciplesSection';
import { StudioSection } from './components/StudioSection';
import { ContactSection } from './components/ContactSection';
import { InquiryModal } from './components/InquiryModal';
import { FrostedGlassCursor } from './components/FrostedGlassCursor';
import { Discipline } from './types';

export default function App() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  const handleSelectDiscipline = (discipline: Discipline) => {
    // Smooth scroll down to work section or handle filtering
    const workElem = document.getElementById('work');
    if (workElem) {
      workElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F4F3EF] relative selection:bg-[#C9C2B4] selection:text-[#0A0A0B]">
      {/* Custom Frosted Glass Cursor Lens */}
      <FrostedGlassCursor />
      
      {/* Floating Navigation Bar */}
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Main Content Sections */}
      <main>
        {/* Scroll-scrubbed Hero Stage */}
        <HeroStage onOpenInquiry={() => setInquiryModalOpen(true)} />

        {/* Selected Work Portfolio Showcase */}
        <FeaturedWorkSection onOpenInquiry={() => setInquiryModalOpen(true)} />

        {/* Disciplines / Capabilities */}
        <DisciplinesSection onSelectDiscipline={handleSelectDiscipline} />

        {/* Principles & Manifesto */}
        <PrinciplesSection />

        {/* Studio Philosophy & Stats */}
        <StudioSection />

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
