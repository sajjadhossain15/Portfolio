import React, { useState } from 'react';
import { Project } from '../types';
import { X, Play, Pause, Sparkles, Sliders, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onOpenInquiry: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenInquiry }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulation' | 'gallery'>('overview');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // 3D / Motion Simulation interactive controls
  const [wireframe, setWireframe] = useState(false);
  const [roughness, setRoughness] = useState(0.2);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [lightingTheme, setLightingTheme] = useState<'obsidian' | 'studio' | 'sunset'>('obsidian');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0A0A0B]/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="liquid-glass border border-[#C9C2B4]/30 rounded-2xl max-w-5xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#232326] flex items-center justify-between shrink-0 bg-[#0A0A0B]/60">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9C2B4] border border-[#232326] px-2.5 py-1 rounded-md">
              {project.category}
            </span>
            <span className="text-xs text-[#8B8B8D] hidden sm:inline">•</span>
            <span className="text-xs text-[#8B8B8D] hidden sm:inline">{project.client}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-[#141416] p-1 rounded-lg border border-[#232326]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded-md text-xs tracking-wider uppercase transition-all ${
                  activeTab === 'overview' ? 'bg-[#C9C2B4] text-[#0A0A0B] font-semibold' : 'text-[#8B8B8D] hover:text-[#F4F3EF]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-3 py-1 rounded-md text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === 'simulation' ? 'bg-[#C9C2B4] text-[#0A0A0B] font-semibold' : 'text-[#8B8B8D] hover:text-[#F4F3EF]'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>3D Sim</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1 rounded-md text-xs tracking-wider uppercase transition-all ${
                  activeTab === 'gallery' ? 'bg-[#C9C2B4] text-[#0A0A0B] font-semibold' : 'text-[#8B8B8D] hover:text-[#F4F3EF]'
                }`}
              >
                Gallery ({project.gallery.length})
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#232326] text-[#8B8B8D] hover:text-[#F4F3EF] hover:border-[#C9C2B4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              {/* Media Hero Stage */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-[#141416] border border-[#232326] group">
                {project.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    src={project.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#C9C2B4] block mb-1">
                      {project.tag} — {project.year}
                    </span>
                    <h3 className="font-serif-custom text-2xl sm:text-4xl text-[#F4F3EF]">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Stats Metrics */}
              {project.stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="p-5 rounded-xl border border-[#232326] bg-[#141416]/50">
                      <span className="text-[10px] uppercase tracking-widest text-[#8B8B8D] block mb-1">
                        {stat.label}
                      </span>
                      <span className="font-serif-custom text-2xl sm:text-3xl text-[#C9C2B4]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Brief & Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#232326] pt-8">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] mb-3">The Brief</h4>
                  <p className="text-sm text-[#F4F3EF] leading-relaxed">{project.brief}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] mb-3">Design Concept</h4>
                  <p className="text-sm text-[#F4F3EF] leading-relaxed">{project.concept}</p>
                </div>
              </div>

              {/* Key Results */}
              {project.results && (
                <div className="border-t border-[#232326] pt-8">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] mb-4">Impact &amp; Recognition</h4>
                  <div className="space-y-3">
                    {project.results.map((res, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F4F3EF]">
                        <CheckCircle2 className="w-4 h-4 text-[#C9C2B4] shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE 3D SIMULATOR */}
          {activeTab === 'simulation' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-custom text-2xl text-[#F4F3EF]">Interactive Asset View</h4>
                  <p className="text-xs text-[#8B8B8D] mt-1">
                    Adjust material roughness, wireframe, and lighting profiles in real-time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3D View Canvas */}
                <div className="lg:col-span-2 aspect-video w-full rounded-2xl overflow-hidden relative bg-[#141416] border border-[#232326] flex items-center justify-center p-6">
                  
                  {/* Procedural Render Simulation Box */}
                  <div 
                    className={`w-64 h-64 rounded-2xl relative transition-all duration-700 flex items-center justify-center ${
                      wireframe ? 'border-2 border-dashed border-[#C9C2B4]' : 'border border-[#232326]'
                    }`}
                    style={{
                      background: lightingTheme === 'obsidian'
                        ? 'radial-gradient(circle, #232326 0%, #0A0A0B 100%)'
                        : lightingTheme === 'studio'
                        ? 'radial-gradient(circle, #3A3A40 0%, #141416 100%)'
                        : 'radial-gradient(circle, #4A3E38 0%, #0A0A0B 100%)',
                      boxShadow: wireframe ? 'none' : `0 0 50px rgba(201, 194, 180, ${1 - roughness})`,
                    }}
                  >
                    <img
                      src={project.heroImage}
                      alt="Sim"
                      className={`w-full h-full object-cover rounded-2xl transition-all duration-500 ${
                        wireframe ? 'opacity-20 filter grayscale invert' : 'opacity-80'
                      }`}
                      style={{
                        filter: `roughness(${roughness}) brightness(${1.1 - roughness * 0.3})`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-mono tracking-widest text-[#C9C2B4] bg-[#0A0A0B]/80 px-3 py-1 rounded-full border border-[#232326]">
                        {lightingTheme.toUpperCase()} SHADER
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls Column */}
                <div className="space-y-6 bg-[#141416]/50 p-6 rounded-2xl border border-[#232326]">
                  <h5 className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D]">Shader Controls</h5>
                  
                  {/* Wireframe Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#F4F3EF]">Wireframe Mode</span>
                    <button
                      onClick={() => setWireframe(!wireframe)}
                      className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                        wireframe ? 'bg-[#C9C2B4] justify-end' : 'bg-[#232326] justify-start'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${wireframe ? 'bg-[#0A0A0B]' : 'bg-[#8B8B8D]'}`} />
                    </button>
                  </div>

                  {/* Roughness Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#F4F3EF]">
                      <span>Surface Roughness</span>
                      <span className="font-mono text-[#8B8B8D]">{Math.round(roughness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={roughness}
                      onChange={(e) => setRoughness(parseFloat(e.target.value))}
                      className="w-full accent-[#C9C2B4] bg-[#232326] rounded-lg"
                    />
                  </div>

                  {/* Lighting Profile Selector */}
                  <div className="space-y-2">
                    <span className="text-xs text-[#F4F3EF] block">Lighting Profile</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['obsidian', 'studio', 'sunset'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setLightingTheme(theme)}
                          className={`py-2 text-[10px] uppercase tracking-wider rounded-lg border transition-all ${
                            lightingTheme === theme
                              ? 'border-[#C9C2B4] bg-[#C9C2B4]/10 text-[#C9C2B4]'
                              : 'border-[#232326] text-[#8B8B8D] hover:text-[#F4F3EF]'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY GRID & LIGHTBOX */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedGalleryImg(imgUrl)}
                    className="aspect-square rounded-xl overflow-hidden bg-[#141416] border border-[#232326] group cursor-pointer relative"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#0A0A0B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-[#F4F3EF]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-[#232326] flex items-center justify-between shrink-0 bg-[#0A0A0B]/80">
          <div className="text-xs text-[#8B8B8D]">
            Have a project in mind? We customize every engagement.
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenInquiry();
            }}
            className="bg-[#C9C2B4] text-[#0A0A0B] px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F4F3EF] transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0A0A0B]" />
            <span>Commission Similar Project</span>
          </button>
        </div>

      </div>

      {/* Lightbox for Gallery Image */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          className="fixed inset-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img
            src={selectedGalleryImg}
            alt="Enlarged view"
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
