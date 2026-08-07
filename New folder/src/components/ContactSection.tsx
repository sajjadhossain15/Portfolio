import React from 'react';
import { Mail, Sparkles, Send, MapPin, Globe, ArrowUpRight } from 'lucide-react';

interface ContactSectionProps {
  onOpenInquiry: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenInquiry }) => {
  return (
    <section id="contact" className="py-24 sm:py-36 border-t border-[#232326] relative bg-[#0A0A0B] flex flex-col justify-between">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 text-center w-full">
        
        <span className="text-xs uppercase tracking-[0.25em] text-[#8B8B8D] block mb-6">
          Start A Project
        </span>

        <h2 className="font-serif-custom font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F4F3EF] max-w-5xl mx-auto leading-[1.05] mb-12">
          Let's build something <br className="hidden sm:inline" />
          <em className="italic font-light text-[#C9C2B4]">worth remembering.</em>
        </h2>

        {/* Primary Contact Email Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <a
            href="mailto:hello@theimaginationstudio.com"
            className="font-serif-custom italic text-xl sm:text-3xl text-[#C9C2B4] border-b border-[#C9C2B4] pb-2 hover:text-[#F4F3EF] hover:border-[#F4F3EF] transition-all duration-300"
          >
            hello@theimaginationstudio.com
          </a>

          <button
            onClick={onOpenInquiry}
            className="bg-[#F4F3EF] text-[#0A0A0B] px-8 py-4 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-[#C9C2B4] transition-all flex items-center gap-2 group shadow-xl hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-[#0A0A0B] group-hover:rotate-12 transition-transform" />
            <span>Launch Inquiry Builder</span>
          </button>
        </div>

        {/* Global Locations Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-24">
          <div className="p-5 rounded-xl border border-[#232326] bg-[#141416]/40">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8B8D] block mb-1">Asia Pacific</span>
            <span className="text-xs font-semibold text-[#F4F3EF] block">Dhaka Studio</span>
            <span className="text-[11px] text-[#8B8B8D] block mt-2">Gulshan Avenue, Dhaka 1212</span>
          </div>

          <div className="p-5 rounded-xl border border-[#232326] bg-[#141416]/40">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8B8D] block mb-1">Europe</span>
            <span className="text-xs font-semibold text-[#F4F3EF] block">Paris Representation</span>
            <span className="text-[11px] text-[#8B8B8D] block mt-2">Rue du Faubourg Saint-Honoré</span>
          </div>

          <div className="p-5 rounded-xl border border-[#232326] bg-[#141416]/40">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8B8D] block mb-1">North America</span>
            <span className="text-xs font-semibold text-[#F4F3EF] block">San Francisco Partner</span>
            <span className="text-[11px] text-[#8B8B8D] block mt-2">Montgomery St, Financial District</span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#232326] pt-8 pb-12 px-6 sm:px-12 md:px-16 max-w-[1440px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-[#8B8B8D]">
        <div className="flex items-center gap-2">
          <span>© 2026 The Imagination Studio. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F3EF] transition-colors flex items-center gap-1">
            <span>Instagram</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F3EF] transition-colors flex items-center gap-1">
            <span>Behance</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F3EF] transition-colors flex items-center gap-1">
            <span>Vimeo</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </section>
  );
};
