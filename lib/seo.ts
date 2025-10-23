import { Metadata } from 'next'

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  ogImage?: string
  ogImageAlt?: string
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: Record<string, any>
}

const defaultSEO: Partial<SEOData> = {
  title: 'IRIS - Intelligence Platform',
  description: 'Advanced Social Media Analytics Dashboard for Intelligence Gathering and Analysis',
  keywords: ['social media analytics', 'intelligence platform', 'data analysis', 'social monitoring'],
  ogImage: '/og-image.png',
  ogImageAlt: 'IRIS Intelligence Platform',
  twitterCard: 'summary_large_image'
}

export function generateMetadata(seoData: Partial<SEOData>): Metadata {
  const data = { ...defaultSEO, ...seoData }

  const title = data.title
  const description = data.description
  const keywords = data.keywords?.join(', ')

  return {
    title,
    description,
    keywords,
    robots: {
      index: !data.noindex,
      follow: !data.nofollow,
      googleBot: {
        index: !data.noindex,
        follow: !data.nofollow,
      },
    },
    openGraph: {
      title,
      description,
      images: data.ogImage ? [
        {
          url: data.ogImage,
          alt: data.ogImageAlt || title,
          width: 1200,
          height: 630,
        }
      ] : undefined,
      type: 'website',
      siteName: 'IRIS Intelligence Platform',
    },
    twitter: {
      card: data.twitterCard,
      title,
      description,
      images: data.ogImage ? [data.ogImage] : undefined,
    },
    alternates: data.canonical ? {
      canonical: data.canonical
    } : undefined,
    other: data.structuredData ? {
      'application/ld+json': JSON.stringify(data.structuredData)
    } : undefined,
  }
}

export const siteConfig = {
  name: 'IRIS Intelligence Platform',
  description: 'Advanced Social Media Analytics Dashboard for Intelligence Gathering and Analysis',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://iris.wiredleap.com',
  ogImage: '/og-image.png',
  creator: '@iris_intelligence',
  keywords: [
    'social media analytics',
    'intelligence platform',
    'data analysis',
    'social monitoring',
    'sentiment analysis',
    'influencer tracking',
    'campaign monitoring',
    'OSINT tools',
    'entity search',
    'social intelligence'
  ]
}

export function generateStructuredData(type: 'WebSite' | 'WebPage' | 'Organization', data: any) {
  const baseUrl = siteConfig.url

  const commonData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'WebSite':
      return {
        ...commonData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }

    case 'WebPage':
      return {
        ...commonData,
        name: data.title,
        description: data.description,
        url: data.url,
        isPartOf: {
          '@type': 'WebSite',
          name: siteConfig.name,
          url: baseUrl
        }
      }

    case 'Organization':
      return {
        ...commonData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          // Add social media URLs if available
        ]
      }

    default:
      return commonData
  }
}