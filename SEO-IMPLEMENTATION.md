# SEO Implementation Guide

This document outlines the comprehensive SEO implementation for the IRIS Intelligence Platform.

## 🎯 Overview

The platform now includes complete SEO optimization with:
- Dynamic metadata generation
- Open Graph tags
- Twitter Card support
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt configuration
- Social media meta tags

## 📁 Files Added/Modified

### Core SEO Library
- `lib/seo.ts` - Main SEO utility functions and configuration

### Layout & Metadata Files
- `app/layout.tsx` - Enhanced with comprehensive metadata and structured data
- `app/login/layout.tsx` - Login page metadata
- `app/signup/layout.tsx` - Signup page metadata
- `app/forgot-password/layout.tsx` - Password reset metadata (noindex)

### SEO Files
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt configuration
- `.env.example` - Environment variables template

### Assets
- `public/og-image.png` - Placeholder for Open Graph image (needs replacement)

## 🔧 Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GOOGLE_SITE_VERIFICATION=your_verification_code
```

### Site Configuration
Update `lib/seo.ts` with your specific:
- Site name and description
- Keywords
- Social media handles
- Open Graph images

## 📊 SEO Features Implemented

### 1. Meta Tags
- Title templates with fallbacks
- Comprehensive descriptions
- Keywords optimization
- Canonical URLs
- Viewport and charset

### 2. Open Graph Tags
- `og:title`, `og:description`, `og:image`
- `og:type`, `og:url`, `og:site_name`
- Proper image dimensions (1200x630)

### 3. Twitter Cards
- Large image summaries
- Proper attribution
- Creator information

### 4. Structured Data (JSON-LD)
- WebSite schema
- Organization schema
- WebPage schema for individual pages
- Search action markup

### 5. Robots & Crawling
- Public pages: `/`, `/login`, `/signup`
- Protected pages blocked appropriately
- Bot-specific rules (GPTBot, CCBot blocked)
- Sitemap reference

## 🚀 Pages with SEO

### Public Pages (Indexed)
- **Homepage** (`/`) - Full SEO optimization
- **Login** (`/login`) - Optimized for authentication
- **Signup** (`/signup`) - Optimized for registration

### Private Pages (No-index)
- **Password Reset** (`/forgot-password`) - Marked as noindex
- **Dashboard & Protected Routes** - Blocked in robots.txt

## 📈 Performance Considerations

- Metadata generated at build time where possible
- Structured data optimized for Core Web Vitals
- Image optimization recommendations included
- Static generation for sitemap and robots.txt

## 🔍 Testing & Validation

### Tools to Use
1. **Google Search Console** - Submit sitemap and monitor indexing
2. **Rich Results Test** - Validate structured data
3. **Open Graph Debugger** - Test social media previews
4. **PageSpeed Insights** - Check Core Web Vitals

### Commands
```bash
# Build and test
npm run build

# Check sitemap (after build)
curl http://localhost:3000/sitemap.xml

# Check robots.txt
curl http://localhost:3000/robots.txt
```

## 📝 Next Steps

1. **Replace OG Image**: Update `/public/og-image.png` with actual 1200x630 branded image
2. **Verify Site**: Add Google Search Console verification
3. **Submit Sitemap**: Submit to Google Search Console and Bing Webmaster Tools
4. **Monitor**: Set up regular SEO monitoring and reporting
5. **Content**: Add more optimized content pages as needed

## 🎨 Design Recommendations

### Open Graph Image
- Size: 1200x630 pixels
- Include IRIS logo/branding
- Use readable fonts
- High contrast colors
- No text smaller than 20px

### Content Guidelines
- Use descriptive, unique titles
- Write compelling meta descriptions (150-160 chars)
- Include relevant keywords naturally
- Maintain consistent branding

## 🔧 Maintenance

- Update sitemap when adding new public pages
- Review robots.txt for new protected routes
- Monitor Core Web Vitals regularly
- Update structured data as needed
- Refresh Open Graph images quarterly

## 📞 Support

For SEO-related questions or issues:
1. Check this documentation first
2. Validate with SEO testing tools
3. Review Next.js 15 SEO documentation
4. Contact development team for technical issues