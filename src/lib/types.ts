export interface AlgorithmStep {
  step: number;
  title: string;
  description: string;
  image: string | null;
}

export interface Algorithm {
  overview: string;
  steps: AlgorithmStep[];
}

export interface ProjectImage {
  filename: string;
  caption: string;
  alt: string;
}

export interface ProjectLinks {
  live: string | null;
  github: string | null;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectChallenge {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  date: string;
  /** ISO-like key (e.g. "2026-07") used for list ordering when date is a display range */
  sortKey?: string;
  thumbnail: string;
  thumbnailAlt: string;
  algorithm: Algorithm;
  images: ProjectImage[];
  links: ProjectLinks;
  techStack?: TechCategory[];
  features?: ProjectFeature[];
  challenges?: ProjectChallenge[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  skills: string[];
  experience: Experience[];
  techStack: TechCategory[];
  contact: ContactInfo;
}
