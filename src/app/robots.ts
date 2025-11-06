// src/app/robots.ts
import { MetadataRoute } from 'next';

const siteUrl = 'https://www.buildbarguna.coop'; // Replace with the actual domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Disallow crawling of the admin area
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
