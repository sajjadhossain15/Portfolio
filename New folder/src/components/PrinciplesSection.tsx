import React, { useState } from 'react';
import { PRINCIPLES } from '../data/studioData';
import { Sparkles } from 'lucide-react';

export const PrinciplesSection: React.FC = () => {
  const [activePrincipleId, setActivePrincipleId] = useState<string | null>('p1');

  return (
    <section id="principles" className="py-24 sm:py-32 border-t border-[#232326] relative bg-[#141416]/30">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16">
        
        {/* Section Label */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-3">
              Principles &amp; Manifesto
            </span>
            <h2 className="font-serif-custom text-3xl sm:text-5xl font-light text-[#F4F3EF]">
              Design Philosophy
            </h2>
          </div>
          <p className="text-xs uppercase tracking-widest text-[#8B8B8D] max-w-xs">
            Our guiding ethos behind every frame, typeface, and 3D simulation we build.
          </p>
        </div>

        {/* Principles Manifesto List */}
        <div className="flex flex-col divide-y divide-[#232326]">
          {PRINCIPLES.map((principle) => {
            const isActive = activePrincipleId === principle.id;

            return (
              <div
                key={principle.id}
                onMouseEnter={() => setActivePrincipleId(principle.id)}
                onClick={() => setActivePrincipleId(isActive ? null : principle.id)}
                className="group py-8 sm:py-10 cursor-pointer transition-all duration-500 hover:pl-6 sm:hover:pl-10 rounded-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-serif-custom font-light text-2xl sm:text-4xl md:text-5xl text-[#8B8B8D] group-hover:text-[#F4F3EF] transition-colors">
                    {principle.lead}{' '}
                    <span className="italic font-light text-[#C9C2B4] group-hover:text-[#F4F3EF] transition-colors">
                      {principle.accent}
                    </span>
                  </h3>

                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 text-[#C9C2B4] transition-opacity duration-300 ${
                      isActive ? 'opacity-100 rotate-12' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                  </div>
                </div>

                {/* Expandable Explanation */}
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-[#232326]/50 max-w-2xl text-xs sm:text-sm text-[#8B8B8D] leading-relaxed animate-in fade-in duration-300">
                    {principle.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
