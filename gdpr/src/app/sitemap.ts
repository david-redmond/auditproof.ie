import type { MetadataRoute } from "next";

/**
 * All public app routes. Next.js serves this at /sitemap.xml
 */
const routes: { path: string; changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"]; priority?: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/gdpr", changeFrequency: "weekly", priority: 0.9 },
  { path: "/partners", changeFrequency: "weekly", priority: 0.9 },
  { path: "/signup", changeFrequency: "weekly", priority: 0.8 },
  { path: "/signin", changeFrequency: "weekly", priority: 0.7 },
  { path: "/security", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
];

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
