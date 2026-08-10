export interface Discipline {
  id: string;
  index: string;
  category?: string;
  name: string;
  tagline: string;
  description: string;
  previewImage: string;
  videoUrl?: string;
  bgVideoUrl?: string;
  portalWorldQuote?: string;
  deliverables: string[];
}

export interface Project {
  id: string;
  title: string;
  tag: string;
  category: string;
  year: string;
  client: string;
  heroImage: string;
  videoUrl?: string;
  gallery: string[];
  brief: string;
  concept: string;
  stats?: { label: string; value: string }[];
  results?: string[];
}

export interface Principle {
  id: string;
  lead: string;
  accent: string;
  description: string;
}

export interface StudioStat {
  label: string;
  value: string;
  subtext: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  client: string;
  company: string;
  discipline: string;
  avatar?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  company: string;
  selectedDisciplines: string[];
  budgetRange: string;
  timeline: string;
  message: string;
}
