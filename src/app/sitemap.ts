import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// URLs carry a trailing slash to match next.config's `trailingSlash: true` —
// without it every entry in the sitemap 308-redirects.
export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllProjectSlugs();
  const now = new Date();

  const projectPages = slugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...projectPages,
  ];
}
