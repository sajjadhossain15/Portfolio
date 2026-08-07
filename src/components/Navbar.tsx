import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Menu, X } from 'lucide-react';
import { synth } from '../utils/audioSynth';

interface NavbarProps {
  onOpenInquiry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down past 60px; show when scrolling up or at top
      if (currentScrollY > 60 && currentScrollY > lastScrollY) {
        setIsVisible(false);
        setMobileMenuOpen(false); // Close mobile menu when scrolling down
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    const playing = synth.toggle();
    setIsAudioPlaying(playing);
  };

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Disciplines', href: '#disciplines' },
    { label: 'Principles', href: '#principles' },
    { label: 'Studio', href: '#studio' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 md:px-12 pt-4 md:pt-6 pointer-events-none transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <nav className="liquid-glass rounded-xl px-4 sm:px-6 py-3 max-w-[1500px] mx-auto flex items-center justify-between pointer-events-auto transition-all duration-300">
        
        {/* Brand Mark */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-serif-custom text-base sm:text-lg tracking-wider text-[#F4F3EF] group-hover:text-[#C9C2B4] transition-colors">
            THE IMAGINATION STUDIO
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#8B8B8D] hidden sm:inline-block border border-[#232326] px-2 py-0.5 rounded-full">
            Est. 2026
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-[#F4F3EF]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="opacity-75 hover:opacity-100 hover:text-[#C9C2B4] transition-all relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C9C2B4] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Ambient Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-xs text-[#8B8B8D] hover:text-[#F4F3EF] ${
              isAudioPlaying 
                ? 'border-[#C9C2B4]/40 bg-[#C9C2B4]/10 text-[#C9C2B4]' 
                : 'border-[#232326] bg-[#141416]/50 hover:border-[#3A3A40]'
            }`}
            title={isAudioPlaying ? 'Mute Ambient Audio' : 'Play Ambient Soundscape'}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse text-[#C9C2B4]" />
                <span className="hidden lg:inline text-[10px] tracking-widest uppercase">Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden lg:inline text-[10px] tracking-widest uppercase">Sound Off</span>
              </>
            )}
          </button>

          {/* Inquiry Primary Button */}
          <button
            onClick={onOpenInquiry}
            className="bg-[#F4F3EF] text-[#0A0A0B] px-4 sm:px-6 py-2 rounded-lg text-xs font-medium tracking-wider uppercase hover:bg-[#C9C2B4] transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-[#C9C2B4]/10 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0A0A0B] group-hover:rotate-12 transition-transform" />
            <span>Inquire</span>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#232326] text-[#F4F3EF] hover:bg-[#232326]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 liquid-glass rounded-xl p-6 pointer-events-auto flex flex-col gap-4 border border-[#232326] animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-[#F4F3EF] hover:text-[#C9C2B4] py-2 border-b border-[#232326]/50"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInquiry();
            }}
            className="w-full bg-[#C9C2B4] text-[#0A0A0B] py-3 rounded-lg text-xs font-semibold uppercase tracking-widest mt-2"
          >
            Start a Project Inquiry
          </button>
        </div>
      )}
    </div>
  );
};
