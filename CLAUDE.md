# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MK-Web is a French freelance web development portfolio and business website built with Next.js 15. The site showcases web development services, includes a blog for SEO content, and features a contact form with reCAPTCHA protection. It's a bilingual site (French/English) with internationalization support.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom orange brand colors (`myorange-100: #FF4A17`, `myorange-200: #E33200`)
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Analytics**: Vercel Analytics, Plausible, Google Analytics, Google Tag Manager
- **Email**: Resend for transactional emails
- **Forms**: React Hook Form with Zod validation
- **Security**: next-recaptcha-v3 for bot protection
- **Storage**: Vercel Blob (for image storage)
- **Rate Limiting**: Vercel KV with @upstash/ratelimit
- **AI Integration**: Replicate (for potential AI features)
- **Blog**: MDX with `@next/mdx`, `gray-matter` for frontmatter parsing
- **Package Manager**: bun

## Common Commands

```bash
# Development
bun dev                 # Start development server (http://localhost:3000)

# Build & Production
bun build              # Build for production
bun start              # Start production server

# Code Quality
bun lint               # Run ESLint
bun format             # Format code with Prettier

# Environment Setup
# Copy .example.env and configure:
# - REPLICATE_API_KEY (for AI features)
# - BLOB_READ_WRITE_TOKEN (Vercel Blob storage)
# - KV_* variables (for rate limiting with Vercel KV)
```

## Project Structure

```
mkweb/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Locale-based routing
│   │   ├── blog/                 # Blog section
│   │   │   ├── _components/      # Blog-specific components
│   │   │   ├── [id]/             # Dynamic blog post pages
│   │   │   └── page.tsx          # Blog listing page
│   │   ├── mentions-legales/     # Legal notices
│   │   ├── nous-contacter/       # Contact page
│   │   ├── layout.tsx            # Locale layout (validates locale)
│   │   ├── not-found.tsx         # Locale-specific 404 page
│   │   ├── page.tsx              # Homepage
│   │   └── template.tsx          # Page transition wrapper
│   ├── api/                      # API routes (no locale prefix)
│   │   └── og/                   # Open Graph image generation
│   ├── layout.tsx                # Root layout with providers
│   ├── robots.ts                 # Robots.txt generator
│   └── sitemap.ts                # Sitemap generator (with locale URLs)
│
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── Icons/                    # Icon components
│   ├── About.tsx                 # About section
│   ├── Hero.tsx                  # Hero section
│   ├── Navbar.tsx                # Navigation (includes locale detection)
│   ├── Footer.tsx                # Footer
│   ├── LanguageSwitcher.tsx      # Language switcher dropdown
│   ├── ServiceShowCase.tsx       # Services display
│   ├── LatestProjects.tsx        # Projects showcase
│   ├── WhatsAppQuickContact.tsx  # WhatsApp floating button
│   └── theme-provider.tsx        # Dark mode support
│
├── lib/                          # Core library code
│   ├── dictionaries/             # Translation files
│   │   ├── fr.json               # French translations
│   │   └── en.json               # English translations
│   ├── dictionaries.ts           # Dictionary loader utility
│   └── i18n.ts                   # i18n configuration and utilities
│
├── data/                         # Static data
│   └── index.ts                  # Blog posts and categories
│
├── hooks/                        # Custom React hooks
│   └── use-toast.ts              # Toast notifications
│
├── service/                      # Business logic
│   └── Contact.ts                # Contact form service
│
├── utils/                        # Utility functions
│   ├── contactInfo.ts            # Contact information
│   ├── send-mail.ts              # Email utilities
│   ├── ReplicateClient.ts        # Replicate API client
│   ├── downloadQrCode.ts         # QR code utilities
│   ├── env.ts                    # Environment validation
│   ├── service.ts                # Service helpers
│   ├── types.ts                  # Utility types
│   └── utils.ts                  # General utilities (cn, etc.)
│
├── types/                        # TypeScript types
│   └── index.ts                  # Shared type definitions
│
└── middleware.ts                 # i18n locale detection/redirect
```

## Architecture & Key Concepts

### Internationalization (i18n)

The site uses Next.js App Router with custom locale-based routing via dynamic `[locale]` segment:

- **Supported locales**: `fr` (default), `en`
- **Configuration**: All locale constants are defined in `locales/i18n.ts` for centralized management
- **URL structure**: All pages are prefixed with locale (e.g., `/fr/blog`, `/en/nous-contacter`)
- **Middleware** (`middleware.ts`):
  - Detects user locale from `NEXT_LOCALE` cookie or `Accept-Language` header
  - Redirects non-localized URLs (e.g., `/blog`) to localized versions (e.g., `/fr/blog`)
  - Skips processing for API routes, `_next` internals, and public files
- **Locale validation**: The `app/[locale]/layout.tsx` validates the locale param and returns 404 for invalid locales
- **Static generation**: `generateStaticParams()` pre-renders all locale variants at build time

**When adding new pages:**
1. Create them inside `app/[locale]/` directory
2. Access the locale via `params.locale` in Server Components
3. Use the `Locale` type from `locales/i18n.ts` for type safety
4. Update the sitemap in `app/sitemap.ts` to include all locale variants

### Translations

The site uses JSON-based translations stored in `locales/dictionaries/`:

- **Translation files**: `fr.json` (French) and `en.json` (English)
- **Loading translations**: Use `getDictionary(locale)` from `lib/dictionaries.ts` in Server Components
- **Type safety**: The `Dictionary` type is exported for type-safe translation access
- **Language switcher**: The `LanguageSwitcher` component in the navbar:
  - Shows a globe icon with a dropdown menu
  - Sets the `NEXT_LOCALE` cookie when switching languages
  - Redirects to the same page in the new locale
  - Highlights the current language in the dropdown

**Using translations in Server Components:**
```typescript
import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MyPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <h1>{dict.common.title}</h1>;
}
```

**Using translations in Client Components:**
- For client components, either:
  1. Pass translations as props from a parent Server Component
  2. Use inline translation objects (see `app/[locale]/not-found.tsx` for example)
  3. Extract locale from pathname using `usePathname()` hook

**Adding new translations:**
1. Add the key-value pairs to both `locales/dictionaries/fr.json` and `locales/dictionaries/en.json`
2. Keep the structure consistent between both files
3. Use nested objects to organize translations by feature/page

### Blog System

- **Data source**: Blog posts are stored as MDX files in `content/blog/` directory
- **MDX Implementation**: Uses Next.js's built-in `@next/mdx` support with dynamic imports
- **Structure**: Each MDX file has:
  - **Frontmatter**: `title`, `description`, `categories`, `author`, `publishedAt`, `readTime`, `image`
  - **Content**: Markdown/MDX with support for custom components
- **Categories**: Defined in `data/index.ts` with color coding (SEO, Refonte, Tech, Next.js, Architecture, TypeScript, Technique)
- **MDX Utilities** (`lib/mdx.ts`):
  - `getAllBlogPosts()`: Fetches all blog posts with metadata using `gray-matter`
  - `getBlogPostById(id)`: Fetches a specific post with content
  - `getBlogPostSlugs()`: Returns all post slugs for static generation
- **Components**:
  - `blog-page.tsx`: Main blog interface with search and filtering
  - `blog-card.tsx`: Individual post preview cards
  - `search-bar.tsx`: Client-side search functionality
  - `category-filter.tsx`: Filter by category
  - `mdx-components.tsx`: Custom MDX component styling (auto-loaded via `mdx-components.tsx` at root)
- **Dynamic routes**: `app/[locale]/blog/[id]/page.tsx` renders individual posts using `next/dynamic` to import MDX files
- **Content format**: MDX files with frontmatter metadata (parsed by `gray-matter`) and Markdown/JSX content

### Styling & Theming

- **Tailwind configuration**: Custom brand colors defined in `tailwind.config.js`
- **Design system**: Uses Shadcn UI components built on Radix UI primitives
- **Dark mode**: Supported via `next-themes` with `ThemeProvider` in layout
- **Custom utilities**: `cn()` helper in `utils/utils.ts` for conditional class merging
- **Brand colors**: Orange (`myorange-100`, `myorange-200`) is the primary brand color

### Layout & Providers

The root layout (`app/layout.tsx`) wraps the application with multiple providers:
1. **ReCaptchaProvider**: Bot protection for forms
2. **ThemeProvider**: Dark/light mode support
3. **PlausibleProvider**: Privacy-friendly analytics
4. **Suspense boundaries**: For navbar and async components

Key features in layout:
- Google Tag Manager and Google Analytics integration
- Vercel Analytics
- Page transitions via `Transition` component
- Persistent components: Navbar, Footer, ScrollToTopButton, WhatsAppQuickContact, Toaster

### Contact Form Flow

1. Form in `app/nous-contacter/page.tsx` uses React Hook Form + Zod validation
2. reCAPTCHA v3 validates on submission
3. Service layer (`service/Contact.ts`) processes the request
4. Email sent via utility in `utils/send-mail.ts` (using Resend)
5. Toast notification confirms success/failure

### SEO Implementation

- **Metadata**: Defined in `app/layout.tsx` with French keywords targeting Chartres region
- **Dynamic metadata**: Each page can override via Next.js metadata API
- **Sitemap**: Auto-generated via `app/sitemap.ts`
- **Robots.txt**: Configured in `app/robots.ts`
- **Open Graph**: Custom OG image generation in `app/api/og/route.tsx`
- **Structured data**: Can be added to individual pages as needed

## Development Guidelines

### Adding New Components

- Place reusable UI components in `components/ui/` (Shadcn style)
- Place page-specific components in the relevant app subdirectory (e.g., `app/blog/_components/`)
- Use TypeScript with proper typing
- Follow the existing naming convention (PascalCase for components)

### Adding New Pages

1. Create the page inside the `app/[locale]/` directory (e.g., `app/[locale]/my-page/page.tsx`)
2. Access the locale parameter in your page component:
   ```typescript
   type Props = {
     params: Promise<{ locale: string }>;
   };

   export default async function MyPage({ params }: Props) {
     const { locale } = await params;
     // Use locale for content/translations
   }
   ```
3. Add metadata for SEO (can be locale-specific)
4. Update `app/sitemap.ts` to include all locale variants
5. Test navigation works for both `/fr/my-page` and `/en/my-page`

### Adding Blog Posts

1. Create a new `.mdx` file in `content/blog/` directory (e.g., `my-post-slug.mdx`)
2. Add frontmatter metadata at the top:
   ```mdx
   ---
   title: "Your Post Title"
   description: "Brief description"
   categories: ["seo", "tech"]
   author: "Mohamad Al-Khatib"
   publishedAt: "2025-06-20"
   readTime: 5
   image: "/blog-image.png"
   ---
   ```
3. Write content in Markdown/MDX format below the frontmatter
4. Use standard Markdown syntax (headings, lists, links, code blocks, etc.)
5. Images should be placed in `public/` and referenced with relative paths
6. Custom components from `mdx-components.tsx` are automatically styled
7. The post will be automatically picked up and displayed in the blog listing

### Environment Variables

Required for full functionality:
- `REPLICATE_API_KEY`: For AI features (QR code generation, etc.)
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage
- `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`: Vercel KV for rate limiting
- `GTM_ID`: Google Tag Manager (optional)

### Code Style

- Use `bun format` before committing
- Follow ESLint rules (`bun lint`)
- Use TypeScript strict mode
- Import paths use `@/` alias (resolves to root)
- Prefer named exports over default exports (except for page components)

## Deployment

- **Platform**: Vercel (with standalone output configured in `next.config.js`)
- **Image domains**: Whitelisted in next.config: `pbxt.replicate.delivery`, `g4yqcv8qdhf169fk.public.blob.vercel-storage.com`
- **Build**: Automatic via Vercel on push to main branch
- **Preview**: Each PR gets a preview deployment

## Notes

- This project was originally based on a QR code generation template but has been adapted for a web development portfolio
- The site targets French-speaking clients in the Chartres region
- Mobile-first responsive design is critical
- Performance (Core Web Vitals) is a priority for SEO
