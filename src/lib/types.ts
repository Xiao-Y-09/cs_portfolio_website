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
  /** Bundled demo build served from public/demos/<slug>/ — relative URL. */
  demo?: string | null;
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
  /** "processing" projects show in the Processing section with a placeholder page. */
  status?: "completed" | "processing";
  title: string;
  summary: string;
  description: string;
  tags: string[];
  date: string;
  /** ISO-like key (e.g. "2026-07") used for list ordering when date is a display range */
  sortKey?: string;
  thumbnail: string;
  thumbnailAlt: string;
  /** Resolved public URL of the cover image, set at build time only when the file exists. */
  thumbnailUrl?: string | null;
  /** Screenshot filename used as the preview fallback (mobile / iframe failure). */
  previewImage?: string;
  /** Resolved public URL of previewImage, set at build time only when the file exists. */
  previewImageUrl?: string | null;
  /** Footnote under the demo preview; overrides the default demo disclaimer. */
  previewNote?: string;
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
  /** Resolved public URL of the hero image, set at build time only when the file exists. */
  avatarUrl?: string | null;
  skills: string[];
  experience: Experience[];
  techStack: TechCategory[];
  contact: ContactInfo;
}
