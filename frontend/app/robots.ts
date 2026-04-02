import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/about", "/privacy", "/login"],
        disallow:  ["/dashboard", "/upload", "/results/", "/pipeline/", "/api/"],
      },
    ],
    sitemap: "https://datastatz.com/sitemap.xml",
    host:    "https://datastatz.com",
  };
}
