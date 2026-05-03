import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://khadma.ma";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/companies", "/pricing", "/contact"],
        disallow: ["/dashboard/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
