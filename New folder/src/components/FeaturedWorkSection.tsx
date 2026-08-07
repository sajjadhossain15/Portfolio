import React, { useState } from 'react';
import { PROJECTS } from '../data/studioData';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ArrowUpRight, Play } from 'lucide-react';

interface FeaturedWorkSectionProps {
  onOpenInquiry: () => void;
}

export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({ onOpenInquiry }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Automotive', 'Branding', '3D & VFX', 'Motion', 'UI/UX'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-20 sm:py-28 relative">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16">
        
        {/* Header and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-3">
              Portfolio
            </span>
            <h2 className="font-serif-custom text-3xl sm:text-5xl font-light text-[#F4F3EF]">
              Selected Work
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#141416] p-1.5 rounded-xl border border-[#232326]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-[#C9C2B4] text-[#0A0A0B] font-semibold'
                    : 'text-[#8B8B8D] hover:text-[#F4F3EF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Stack Container */}
        <div className="relative space-y-12 sm:space-y-16 pb-12">
          {filteredProjects.map((project, idx) => {
            const isEven = idx % 2 === 1;
            const topOffset = 96 + idx * 16; // Sticky top offset creating a stacked card deck effect

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                style={{ top: `${topOffset}px` }}
                className="sticky group cursor-pointer bg-[#121214]/95 border border-[#232326] hover:border-[#C9C2B4]/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all duration-500"
              >
                {/* Top Card Info Bar */}
                <div className="flex items-center justify-between border-b border-[#232326] pb-4 mb-6 sm:mb-8 text-xs font-mono text-[#8B8B8D]">
                  <div className="flex items-center gap-3">
                    <span className="text-[#C9C2B4] font-bold">PROJECT 0{idx + 1}</span>
                    <span>/</span>
                    <span className="uppercase tracking-widest text-[#F4F3EF]">{project.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{project.year}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Visual Media Container */}
                  <div
                    className={`lg:col-span-7 aspect-[16/10] bg-gradient-to-br from-[#141416] to-[#2A2D33] rounded-xl sm:rounded-2xl overflow-hidden relative border border-[#232326] group-hover:border-[#C9C2B4]/50 transition-all duration-500 shadow-lg ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105 group-hover:brightness-100"
                    />

                    {/* Gradient & Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                    {/* Video Badge Indicator */}
                    {project.videoUrl && (
                      <div className="absolute top-4 right-4 bg-[#0A0A0B]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#232326] flex items-center gap-2 text-[10px] text-[#C9C2B4] uppercase tracking-widest">
                        <Play className="w-3 h-3 fill-[#C9C2B4]" />
                        <span>Video Available</span>
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs uppercase tracking-widest text-[#F4F3EF] bg-[#0A0A0B]/90 px-4 py-2 rounded-lg backdrop-blur-md border border-[#232326]">
                        Explore Experience
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#C9C2B4] text-[#0A0A0B] flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Metadata Column */}
                  <div
                    className={`lg:col-span-5 space-y-4 ${
                      isEven ? 'lg:order-1 lg:pr-6' : 'lg:order-2 lg:pl-6'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#C9C2B4] font-medium">
                        {project.tag}
                      </span>
                      <span className="text-[#232326]">•</span>
                      <span className="text-xs text-[#8B8B8D] font-mono">{project.client || 'Studio Client'}</span>
                    </div>

                    <h3 className="font-serif-custom text-2xl sm:text-3xl md:text-4xl text-[#F4F3EF] group-hover:text-[#C9C2B4] transition-colors leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#8B8B8D] leading-relaxed line-clamp-3">
                      {project.brief}
                    </p>

                    <div className="pt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#F4F3EF] group-hover:text-[#C9C2B4] transition-colors">
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
