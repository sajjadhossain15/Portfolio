import React, { useState } from 'react';
import { DISCIPLINES } from '../data/studioData';
import { X, Sparkles, Check, Send, CheckCircle2 } from 'lucide-react';
import { InquiryFormData } from '../types';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    company: '',
    selectedDisciplines: ['brand-identity'],
    budgetRange: '$25k – $50k',
    timeline: '2 – 4 Months',
    message: '',
  });

  if (!isOpen) return null;

  const budgetOptions = ['$10k – $25k', '$25k – $50k', '$50k – $100k', '$100k+'];
  const timelineOptions = ['1 – 2 Months', '2 – 4 Months', '4+ Months', 'Flexible'];

  const toggleDiscipline = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedDisciplines.includes(id);
      if (exists) {
        if (prev.selectedDisciplines.length === 1) return prev; // Keep at least 1
        return { ...prev, selectedDisciplines: prev.selectedDisciplines.filter((d) => d !== id) };
      } else {
        return { ...prev, selectedDisciplines: [...prev.selectedDisciplines, id] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0A0A0B]/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="liquid-glass border border-[#C9C2B4]/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#232326] flex items-center justify-between shrink-0 bg-[#0A0A0B]/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9C2B4]" />
            <h3 className="font-serif-custom text-xl text-[#F4F3EF]">Project Inquiry Builder</h3>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="p-2 rounded-lg border border-[#232326] text-[#8B8B8D] hover:text-[#F4F3EF] hover:border-[#C9C2B4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#C9C2B4]/10 text-[#C9C2B4] border border-[#C9C2B4]/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <h4 className="font-serif-custom text-3xl text-[#F4F3EF]">Inquiry Received</h4>
              
              <p className="text-sm text-[#8B8B8D] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-[#F4F3EF] font-semibold">{formData.name}</span>. Our partners in Dhaka and Paris have received your brief. We will review your scope and respond within 24 hours with an initial consultation proposal.
              </p>

              <div className="p-4 rounded-xl border border-[#232326] bg-[#141416]/50 max-w-sm mx-auto text-xs text-[#8B8B8D] space-y-1 font-mono">
                <div>Inquiry ID: <span className="text-[#C9C2B4]">#IS-{Math.floor(100000 + Math.random() * 900000)}</span></div>
                <div>Status: <span className="text-[#C9C2B4]">Under Review</span></div>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#F4F3EF] text-[#0A0A0B] px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-[#C9C2B4] transition-colors"
              >
                Return to Studio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Select Disciplines */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-3">
                  1. Which disciplines do you need?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DISCIPLINES.map((d) => {
                    const isSelected = formData.selectedDisciplines.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => toggleDiscipline(d.id)}
                        className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'border-[#C9C2B4] bg-[#C9C2B4]/10 text-[#F4F3EF]'
                            : 'border-[#232326] bg-[#141416]/40 text-[#8B8B8D] hover:border-[#3A3A40]'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-[#C9C2B4]">{d.index}</span>
                        <span className="font-medium line-clamp-2">{d.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Budget Range */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-3">
                  2. Anticipated Investment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFormData({ ...formData, budgetRange: opt })}
                      className={`py-3 px-4 rounded-xl text-xs tracking-wider uppercase border text-center transition-all ${
                        formData.budgetRange === opt
                          ? 'border-[#C9C2B4] bg-[#C9C2B4] text-[#0A0A0B] font-semibold'
                          : 'border-[#232326] bg-[#141416]/40 text-[#8B8B8D] hover:border-[#3A3A40]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Timeline */}
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-3">
                  3. Estimated Timeline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timelineOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFormData({ ...formData, timeline: opt })}
                      className={`py-3 px-4 rounded-xl text-xs tracking-wider uppercase border text-center transition-all ${
                        formData.timeline === opt
                          ? 'border-[#C9C2B4] bg-[#C9C2B4] text-[#0A0A0B] font-semibold'
                          : 'border-[#232326] bg-[#141416]/40 text-[#8B8B8D] hover:border-[#3A3A40]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Contact Details */}
              <div className="space-y-4 border-t border-[#232326] pt-6">
                <label className="text-xs uppercase tracking-[0.2em] text-[#8B8B8D] block mb-1">
                  4. Contact Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#141416] border border-[#232326] rounded-xl px-4 py-3 text-xs text-[#F4F3EF] placeholder-[#8B8B8D] focus:outline-none focus:border-[#C9C2B4]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#141416] border border-[#232326] rounded-xl px-4 py-3 text-xs text-[#F4F3EF] placeholder-[#8B8B8D] focus:outline-none focus:border-[#C9C2B4]"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Company / Brand Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#141416] border border-[#232326] rounded-xl px-4 py-3 text-xs text-[#F4F3EF] placeholder-[#8B8B8D] focus:outline-none focus:border-[#C9C2B4]"
                />

                <textarea
                  rows={3}
                  placeholder="Project Overview / Goals *"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#141416] border border-[#232326] rounded-xl px-4 py-3 text-xs text-[#F4F3EF] placeholder-[#8B8B8D] focus:outline-none focus:border-[#C9C2B4] resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#F4F3EF] text-[#0A0A0B] px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-[#C9C2B4] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
