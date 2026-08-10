import React, { useState } from 'react';
import { STUDIO_STATS, TESTIMONIALS } from '../data/studioData';
import { Play, X, Quote, Globe, Award, ShieldCheck, Clock } from 'lucide-react';

export const StudioSection: React.FC = () => {
  const [showReelModal, setShowReelModal] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  return (
    <section id="studio" className="relative w-full min-h-[100svh] flex flex-col justify-center py-12 lg:py-16 border-t border-[#232326] bg-[#000000] mt-[50px]">
      <div className="site-container">
        
        {/* Studio Statement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 sm:mb-24">
          <div className="lg:col-span-4">
            <span className="font-mono text-label text-[#8B8B8D] block mb-3">
              The Studio
            </span>
            <h2 className="font-sans text-h2 font-medium text-[#F4F3EF]">
              Design is not decoration. It is experience.
            </h2>

            {/* Showreel Button */}
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => setShowReelModal(true)}
                className="glass-control-subtle border border-[#C9C2B4]/40 hover:border-[#C9C2B4] text-[#F4F3EF] px-5 sm:px-6 py-3 rounded-lg font-mono text-label flex items-center gap-3 group transition-all"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C9C2B4] text-[#0A0A0B] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#0A0A0B] ml-0.5" />
                </div>
                <span>Play 2026 Showreel</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 font-sans text-body-lg text-[#F4F3EF] space-y-4 sm:space-y-6">
            <p>
              The Imagination Studio was founded on a simple belief:{' '}
              <span className="text-[rgba(244,243,239,0.65)]">
                design is not decoration, it is experience.
              </span>{' '}
              Every project we take on is treated as a world of its own — built from story outward, not surface inward.
            </p>
            <p className="text-[rgba(244,243,239,0.65)]">
              We work across graphic design, brand identity, automotive design, 3D visualization, motion graphics, animation, VFX, and UI/UX — not as separate services, but as one continuous creative language, shaped for clients who value originality over template.
            </p>

            {/* Global Presence Banner */}
            <div className="p-4 sm:p-6 rounded-[20px] border border-[#232326] bg-[#141416]/50 flex flex-wrap items-center justify-between gap-4 mt-6 sm:mt-8">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#C9C2B4] shrink-0" />
                <div>
                  <span className="font-sans text-body font-medium text-[#F4F3EF] block">Headquartered in Dhaka, Bangladesh</span>
                  <span className="font-mono text-micro text-[#8B8B8D]">Serving Paris, London, Geneva, Tokyo &amp; San Francisco</span>
                </div>
              </div>
              <span className="font-mono text-micro text-[#C9C2B4] bg-[#C9C2B4]/10 border border-[#C9C2B4]/20 px-3 py-1 rounded-full">
                Global Operations
              </span>
            </div>
          </div>
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-24 border-t border-b border-[#232326] py-8 sm:py-12">
          {STUDIO_STATS.map((stat) => (
            <div key={stat.label} className="p-4 sm:p-6 rounded-[20px] border border-[#232326] bg-[#141416]/30">
              <span className="font-sans text-h1 font-medium text-[#C9C2B4] block mb-1 sm:mb-2">
                {stat.value}
              </span>
              <span className="font-mono text-label text-[#F4F3EF] block mb-1">
                {stat.label}
              </span>
              <span className="font-mono text-micro text-[#8B8B8D]">
                {stat.subtext}
              </span>
            </div>
          ))}
        </div>

        {/* Client Testimonials */}
        <div className="glass-card-large border border-[#232326] rounded-[24px] p-6 sm:p-12 relative overflow-hidden">
          <Quote className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-32 sm:h-32 text-[#232326]/30 pointer-events-none" />
          
          <span className="font-mono text-label text-[#C9C2B4] block mb-4 sm:mb-6">
            Client Perspectives
          </span>

          <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-between">
            <p className="font-sans text-body-lg sm:text-h3 font-medium text-[#F4F3EF] max-w-4xl">
              "{TESTIMONIALS[activeTestimonialIdx].quote}"
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-[#232326]">
              <div>
                <span className="text-sm font-semibold text-[#F4F3EF] block">
                  {TESTIMONIALS[activeTestimonialIdx].client}
                </span>
                <span className="text-xs text-[#8B8B8D]">
                  {TESTIMONIALS[activeTestimonialIdx].company} — {TESTIMONIALS[activeTestimonialIdx].discipline}
                </span>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeTestimonialIdx === idx ? 'w-8 bg-[#C9C2B4]' : 'w-2 bg-[#232326] hover:bg-[#8B8B8D]'
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Showreel Video Modal */}
      {showReelModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
          <div className="glass-card-large border border-[#232326] hover:border-[#C9C2B4]/30 rounded-[24px] max-w-5xl w-full p-4 relative overflow-hidden shadow-2xl transition-colors">
            <button
              onClick={() => setShowReelModal(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[#0A0A0B]/80 text-[#F4F3EF] hover:bg-[#232326] transition-colors border border-[#232326]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#141416] relative">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
                controls
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
