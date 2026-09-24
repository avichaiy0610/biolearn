import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/he/admin", "/en/admin", "/he/profile", "/en/profile"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
