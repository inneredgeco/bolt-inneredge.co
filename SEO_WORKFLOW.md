# SEO Meta Entry Creation Workflow

This document outlines the standard workflow for creating SEO meta entries whenever a new page is added to the application.

## Overview

Every new page in the application should automatically have a corresponding `seo_meta` database entry created. This ensures all pages have proper SEO configuration from the start, which can be edited later through the SEO Manager admin interface.

## Process for Creating New Pages

When creating a new page, follow these steps:

### Step 1: Create the Page Component

Create the page file with the `SEOHead` component:

```tsx
import { SEOHead } from './SEOHead';

export function NewPage() {
  return (
    <div>
      <SEOHead
        pagePath="/new-page"
        fallbackTitle="New Page | Inner Edge"
        fallbackDescription="Description of the new page..."
        fallbackOgImage="https://cdn.inneredge.co/og-images/default-og.jpg"
      />

      {/* Page content */}
    </div>
  );
}
```

### Step 2: Add Route to App.tsx

Add the route to `src/App.tsx`:

```tsx
import { NewPage } from './components/NewPage';

// In Routes:
<Route path="/new-page" element={<NewPage />} />
```

### Step 3: Create Database Entry

Automatically insert the corresponding entry into the `seo_meta` table:

```sql
INSERT INTO seo_meta (
  page_path,
  page_title,
  meta_description,
  og_image_url,
  og_url
) VALUES (
  '/new-page',
  'New Page | Inner Edge',
  'Description of the new page...',
  'https://cdn.inneredge.co/og-images/default-og.jpg',
  'https://www.inneredge.co/new-page'
)
ON CONFLICT (page_path) DO NOTHING;
```

## Default Values

If specific SEO values are not provided, use these defaults:

| Field | Default Value |
|-------|---------------|
| `page_title` | `[Page Name] \| Inner Edge` |
| `meta_description` | `Inner Edge - [Page Name]` |
| `og_image_url` | `https://cdn.inneredge.co/og-images/default-og.jpg` |
| `og_url` | `https://www.inneredge.co/[page-path]` |
| `twitter_card` | `summary_large_image` |

## Example: Creating a Services Page

### 1. Create Component (`src/components/ServicesPage.tsx`)

```tsx
import { SEOHead } from './SEOHead';

export function ServicesPage() {
  return (
    <div>
      <SEOHead
        pagePath="/services"
        fallbackTitle="Services | Inner Edge"
        fallbackDescription="Explore our coaching services and programs for men's personal development."
        fallbackOgImage="https://cdn.inneredge.co/og-images/default-og.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1>Our Services</h1>
        {/* Services content */}
      </div>
    </div>
  );
}
```

### 2. Add Route to `App.tsx`

```tsx
import { ServicesPage } from './components/ServicesPage';

<Route path="/services" element={<ServicesPage />} />
```

### 3. Insert Database Entry

```sql
INSERT INTO seo_meta (
  page_path,
  page_title,
  meta_description,
  og_image_url,
  og_url
) VALUES (
  '/services',
  'Services | Inner Edge',
  'Explore our coaching services and programs for men''s personal development.',
  'https://cdn.inneredge.co/og-images/default-og.jpg',
  'https://www.inneredge.co/services'
)
ON CONFLICT (page_path) DO NOTHING;
```

## Editing SEO Meta

Once a page is created with its initial SEO configuration, users can:

1. Navigate to `/admin/seo-manager` in the admin panel
2. Search for the page by path
3. Click "Edit" to modify any SEO field
4. Upload custom Open Graph images
5. Configure Twitter card settings
6. Add local business information (locality, region)
7. Customize keywords

## Important Notes

- **Always use the same values** in the `SEOHead` component and the database entry
- **Page paths must start with `/`** (e.g., `/about`, not `about`)
- **Use `ON CONFLICT (page_path) DO NOTHING`** to avoid duplicate entries
- **The database entry is authoritative** - `SEOHead` will fetch from database first, then use fallback values
- **OG images should be 1200x630px** (1.91:1 aspect ratio) for optimal social media display

## SEOHead Component Props

The `SEOHead` component accepts these props:

```tsx
interface SEOHeadProps {
  pagePath?: string;           // Page path to fetch SEO data from database
  fallbackTitle?: string;      // Title if database entry doesn't exist
  fallbackDescription?: string; // Description if database entry doesn't exist
  fallbackOgImage?: string;    // OG image URL if database entry doesn't exist
  title?: string;              // Override title (use fallbackTitle instead)
  description?: string;        // Override description (use fallbackDescription instead)
}
```

## Current Pages with SEO Meta

All existing pages have been seeded with SEO meta entries:

- `/` - Homepage
- `/about` - About Page
- `/blog` - Blog Page
- `/podcast` - Podcast Page
- `/contact` - Contact Page
- `/booking` - Booking Page
- `/vision-builder` - Vision Builder
- `/guests` - Podcast Guests Directory
- `/podcast-guest` - Become a Guest
- `/podcast-guest-form` - Guest Application
- `/podcast-guest-onboarding` - Guest Onboarding
- `/privacy-policy` - Privacy Policy
- `/emotional-release-techniques` - ERT Page
- `/rise-course-resources` - RISE Course Resources
- `/link` - Links Page

## Checklist for New Pages

- [ ] Create page component with `SEOHead`
- [ ] Add route to `App.tsx`
- [ ] Insert `seo_meta` database entry with same values
- [ ] Test page loads correctly
- [ ] Verify SEO meta appears in page source (view source in browser)
- [ ] Confirm entry appears in SEO Manager admin panel

## Questions?

For questions about SEO configuration or the SEO Manager, refer to the admin documentation or check the SEO Manager page at `/admin/seo-manager`.
