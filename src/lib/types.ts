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
  /** Not built yet: kept out of the home page and out of the routes entirely.
   *  Drop the flag once the project has something to show. */
  draft?: boolean;
  /**
   * Set from FEATURED_SLUGS in lib/projects.ts, not from the JSON. True means
   * the project gets a full card at the top of the home page; everything else
   * falls to the compact list below. The detail page ignores this.
   */
  featured?: boolean;
  title: string;
  summary: string;
  /** One short fact — the hardest constraint or the measurable result. Shown
   *  under the summary on featured cards only. */
  impact?: string;
  description: string;
  tags: string[];
  date: string;
  /** ISO-like key (e.g. "2026-07") used for list ordering when date is a display range */
  sortKey?: string;
  thumbnail: string;
  thumbnailAlt: string;
  /** Resolved public URL of the cover image, set at build time only when the file exists. */
  thumbnailUrl?: string | null;
  /** True when the cover has a baked-in light background, so the dark theme inverts it. Set at build time. */
  thumbnailOnLight?: boolean;
  /** Same, for previewImage. Set at build time. */
  previewOnLight?: boolean;
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
  /**
   * 描述里哪些词要变成链接：原词 -> 网址。
   * 描述本体仍然是一句读得顺的话，改文案时不用拆成一堆片段；
   * 这里没匹配到的词会安静地什么也不发生。
   */
  links?: Record<string, string>;
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

/** 自我介绍。断行和条目写在数据里，不靠容器宽度去撞 ——
 *  换个屏宽就换个断法的话没法看。 */
export interface Bio {
  /** 开场几句，一个元素一行。 */
  lines: string[];
  /** 条目前的引子。 */
  listTitle: string;
  list: string[];
}

export interface Profile {
  name: string;
  /** 名字怎么念。招聘方念不出名字就不会在电话里叫它 —— 直接写在名字下面。 */
  pronunciation: string;
  title: string;
  /** 名字下面那几行，一个元素一行：学历、在找什么。断行位置写死在数据里，
   *  不靠容器宽度去撞 —— 换个屏幕宽度就换个断法的话没法看。 */
  tagline: string[];
  bio: Bio;
  skills: string[];
  experience: Experience[];
  contact: ContactInfo;
}
