import React, { useState } from 'react';
import { STUDIO_STATS, TESTIMONIALS } from '../data/studioData';
import { Play, X, Quote, Globe, Award, ShieldCheck, Clock } from 'lucide-react';

export const StudioSection: React.FC = () => {
  const [showReelModal, setShowReelModal] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  return (
    <section id="studio" className="py-24 sm:py-32 border-t border-[#232326] relative">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16">
        
        {/* Studio Statement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-3">
              The Studio
            </span>
            <h2 className="font-serif-custom text-3xl sm:text-5xl font-light text-[#F4F3EF] leading-tight">
              Design is not decoration. It is experience.
            </h2>

            {/* Showreel Button */}
            <div className="mt-8">
              <button
                onClick={() => setShowReelModal(true)}
                className="liquid-glass border border-[#C9C2B4]/40 hover:border-[#C9C2B4] text-[#F4F3EF] px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-3 group transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#C9C2B4] text-[#0A0A0B] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-[#0A0A0B] ml-0.5" />
                </div>
                <span>Play 2026 Showreel</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 text-sm sm:text-base leading-relaxed text-[#F4F3EF] space-y-6">
            <p>
              The Imagination Studio was founded on a simple belief:{' '}
              <span className="text-[#8B8B8D]">
                design is not decoration, it is experience.
              </span>{' '}
              Every project we take on is treated as a world of its own — built from story outward, not surface inward.
            </p>
            <p className="text-[#8B8B8D]">
              We work across graphic design, brand identity, automotive design, 3D visualization, motion graphics, animation, VFX, and UI/UX — not as separate services, but as one continuous creative language, shaped for clients who value originality over template.
            </p>

            {/* Global Presence Banner */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#141416]/50 flex flex-wrap items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#C9C2B4]" />
                <div>
                  <span className="text-xs font-semibold text-[#F4F3EF] block">Headquartered in Dhaka, Bangladesh</span>
                  <span className="text-[11px] text-[#8B8B8D]">Serving Paris, London, Geneva, Tokyo &amp; San Francisco</span>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#C9C2B4] bg-[#C9C2B4]/10 border border-[#C9C2B4]/20 px-3 py-1 rounded-full">
                Global Operations
              </span>
            </div>
          </div>
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 border-t border-b border-[#232326] py-12">
          {STUDIO_STATS.map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl border border-[#232326] bg-[#141416]/30">
              <span className="font-serif-custom text-4xl sm:text-5xl text-[#C9C2B4] block mb-2">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#F4F3EF] font-semibold block mb-1">
                {stat.label}
              </span>
              <span className="text-[11px] text-[#8B8B8D]">
                {stat.subtext}
              </span>
            </div>
          ))}
        </div>

        {/* Client Testimonials */}
        <div className="liquid-glass border border-[#232326] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <Quote className="absolute -top-6 -right-6 w-32 h-32 text-[#232326]/30 pointer-events-none" />
          
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9C2B4] block mb-6">
            Client Perspectives
          </span>

          <div className="min-h-[160px] flex flex-col justify-between">
            <p className="font-serif-custom font-light text-lg sm:text-2xl text-[#F4F3EF] leading-relaxed max-w-4xl">
              "{TESTIMONIALS[activeTestimonialIdx].quote}"
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#232326]">
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
          <div className="liquid-glass border border-[#C9C2B4]/30 rounded-2xl max-w-5xl w-full p-4 relative overflow-hidden shadow-2xl">
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
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
