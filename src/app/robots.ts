import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // server endpoints — no need to crawl
          "/admin", // future admin dashboard
          "/parent/", // private user area
          "/eleve/", // private user area
          "/petits/", // private user area
          "/_next/", // Next.js internals
        ],
      },
    ],
    sitemap: "https://naja7dz.com/sitemap.xml",
    host: "https://naja7dz.com",
  };
}
