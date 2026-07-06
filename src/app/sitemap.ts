import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://your-domain.vercel.app";
  const slugs = getAllProjectSlugs();
  const now = new Date();

  const projectPages = slugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...projectPages,
  ];
}
