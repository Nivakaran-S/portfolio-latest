import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

/**
 * One `User-agent: *` group only. Cloudflare prepends its managed AI-crawler
 * block in production; if our group is a second `*` group, crawlers that read
 * only the first match can skip the /admin and /api rules.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
