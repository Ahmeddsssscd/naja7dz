import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://naja7dz.com";

// Routes that are localized — each gets a /fr and /ar variant with hreflang.
const LOCALIZED_ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/tarifs", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pour-les-parents", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/legal/conditions", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/confidentialite", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/loi-18-07", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal/mentions", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LOCALIZED_ROUTES.flatMap((route) =>
    routing.locales.map((locale) => {
      const localePrefix =
        locale === routing.defaultLocale ? "" : `/${locale}`;
      const url = `${BASE}${localePrefix}${route.path}`;

      // Build hreflang alternates so Google knows about both language versions
      const alternates: Record<string, string> = {
        "x-default": `${BASE}${route.path}`,
      };
      for (const l of routing.locales) {
        const prefix = l === routing.defaultLocale ? "" : `/${l}`;
        alternates[l] = `${BASE}${prefix}${route.path}`;
      }

      return {
        url,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: alternates },
      };
    }),
  );
}
