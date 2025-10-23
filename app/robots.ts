import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/signup',
        ],
        disallow: [
          '/forgot-password/',
          '/api/',
          '/*verify-otp',
          '/dashboard/',
          '/admin/',
          '/profile/',
          '/settings/',
          '/campaigns/',
          '/analytics/',
          '/social-feed/',
          '/entities/',
          '/locations/',
          '/organizations/',
          '/profiles/',
          '/analysis-history/',
          '/breached-data/',
          '/groups/',
          '/osint-tools/',
          '/social-inbox/',
          '/entity-search/',
          '/start-analysis/',
          '/post-campaign/',
          '/clear-auth/',
          '/debug-auth/',
          '/test-*',
          '/optimized-components/',
        ],
      },
      // Additional rules for specific bots if needed
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

// Generate static robots.txt at build time
export const dynamic = 'force-static'