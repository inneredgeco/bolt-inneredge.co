# SEO Workflow - Simple Hardcoded Approach

This document explains the simple, reliable approach to managing SEO meta tags in this application.

## Overview

All SEO meta tags are **hardcoded directly in each page component** using the `SEOHead` component. This approach is simple, reliable, and predictable.

## How It Works

Each page component includes a `SEOHead` component with specific props:

```tsx
import { SEOHead } from './SEOHead';

export function AboutPage() {
  return (
    <div>
      <SEOHead
        title="About Soleiman | Inner Edge"
        description="Learn about Soleiman and Inner Edge's mission to help men..."
        keywords="about soleiman, life coach, mens coach"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        ogUrl="https://www.inneredge.co/about"
      />

      {/* Page content */}
    </div>
  );
}
```

## Changing SEO Values

To change SEO meta tags for a page:

1. Open the page component file in `/src/components/`
2. Find the `<SEOHead>` component
3. Edit the props directly
4. Deploy the changes

**Example:** To change the About page title:
- Open `/src/components/AboutPage.tsx`
- Change `title="About Soleiman | Inner Edge"` to your new title
- Deploy

## Available SEOHead Props

```tsx
interface SEOHeadProps {
  title?: string;              // Page title (appears in browser tab)
  description?: string;        // Meta description (appears in search results)
  keywords?: string;           // Keywords for search engines
  ogImage?: string;            // Open Graph image URL (social media preview)
  ogUrl?: string;              // Canonical URL
  canonical?: string;          // Alternative canonical URL
  locality?: string;           // City (default: 'San Diego')
  region?: string;             // State (default: 'CA')
  type?: 'website' | 'article'; // Page type (default: 'website')
  author?: string;             // Author name (for articles)
  publishedTime?: string;      // Publish date (for articles)
  modifiedTime?: string;       // Modified date (for articles)
  wordCount?: number;          // Word count (for articles)
}
```

## Default Values

If props are not provided, these defaults are used:

- **Title:** `"Inner Edge"`
- **Description:** `"Transform your life from the inside out with Inner Edge."`
- **Keywords:** `"mens coaching, life coaching for men, personal development..."`
- **OG Image:** `"https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"`
- **Locality:** `"San Diego"`
- **Region:** `"CA"`

## Example: Creating a New Page

```tsx
import { SEOHead } from './SEOHead';
import { Header } from './Header';
import { Footer } from './Footer';

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead
        title="Services | Inner Edge"
        description="Explore our coaching services and programs for men's personal development."
        keywords="coaching services, mens programs, personal development"
        ogImage="https://inner-edge.b-cdn.net/Inner-Edge-Open-Graph.png"
        ogUrl="https://www.inneredge.co/services"
      />

      <Header />

      <main>
        <h1>Our Services</h1>
        {/* Page content */}
      </main>

      <Footer />
    </div>
  );
}
```

Then add the route in `App.tsx`:

```tsx
<Route path="/services" element={<ServicesPage />} />
```

## Why This Approach?

1. **Simple:** No database queries, no complex state management
2. **Reliable:** Always works, no loading states or errors
3. **Fast:** No API calls on every page load
4. **Predictable:** Edit component = change meta tags
5. **Version Controlled:** All SEO changes tracked in git

## Blog Posts Exception

Blog posts use dynamic SEO based on the post data fetched from the database. The `BlogPostPage` component passes post-specific data to `SEOHead`:

```tsx
<SEOHead
  title={`${post.title} | Inner Edge Blog`}
  description={post.meta_description}
  keywords={post.keywords}
  ogImage={post.featured_image_url}
  ogUrl={`https://www.inneredge.co/blog/${post.slug}`}
  type="article"
  author={post.author}
  publishedTime={post.published_at}
  modifiedTime={post.updated_at}
/>
```

## Checklist for New Pages

- [ ] Create page component with `SEOHead`
- [ ] Add all relevant SEO props (title, description, keywords, ogImage, ogUrl)
- [ ] Add route to `App.tsx`
- [ ] Test page loads correctly
- [ ] View page source to verify meta tags appear

## Need to Change Meta Tags?

Edit the component file in Bolt, then deploy. That's it!
