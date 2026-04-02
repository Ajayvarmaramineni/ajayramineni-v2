import type { MetadataRoute } from "next";

const BASE = "https://datastatz.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:              BASE,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         1.0,
    },
    {
      url:              `${BASE}/about`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.8,
    },
    {
      url:              `${BASE}/privacy`,
      lastModified:     new Date(),
      changeFrequency:  "yearly",
      priority:         0.3,
    },
    {
      url:              `${BASE}/login`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.6,
    },
  ];
}
