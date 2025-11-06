// src/app/sitemap.ts
import { MetadataRoute } from 'next';

// This is a simplified version. In a real app, you'd fetch dynamic
// routes (e.g., brands, stories) from the database.
const staticRoutes = [
  '',
  '/about',
  '/programs',
  '/brands',
  '/members',
  '/governance',
  '/stories',
  '/partners',
  '/contact',
  '/donations',
];

const locales = ['en', 'bn'];
const siteUrl = 'https://www.buildbarguna.coop'; // Replace with the actual domain

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = staticRoutes.flatMap((route) => {
    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
    }));
  });

  return routes;
}
