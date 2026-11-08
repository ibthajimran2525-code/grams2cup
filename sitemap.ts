import type { MetadataRoute } from "next";
import { INGREDIENTS, SITE_URL, getStaticCombos } from "@/lib/ingredients";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...INGREDIENTS.map((i) => ({ url: `${SITE_URL}/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getStaticCombos(1000).map((p) => ({ url: `${SITE_URL}/${p.ingredient}/${p.conversion}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
