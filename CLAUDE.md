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
│   ├── api/                      # API routes
│   │   └── og/                   # Open Graph image generation
│   ├── blog/                     # Blog section
│   │   ├── _components/          # Blog-specific components
│   │   ├── [id]/                 # Dynamic blog post pages
│   │   └── page.tsx              # Blog listing page
│   ├── mentions-legales/         # Legal notices
│   ├── nous-contacter/           # Contact page
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   ├── robots.ts                 # Robots.txt generator
│   ├── sitemap.ts                # Sitemap generator
│   └── template.tsx              # Page transition wrapper
│
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── Icons/                    # Icon components
│   ├── About.tsx                 # About section
│   ├── Hero.tsx                  # Hero section
│   ├── Navbar.tsx                # Navigation
│   ├── Footer.tsx                # Footer
│   ├── ServiceShowCase.tsx       # Services display
│   ├── LatestProjects.tsx        # Projects showcase
│   ├── WhatsAppQuickContact.tsx  # WhatsApp floating button
│   └── theme-provider.tsx        # Dark mode support
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

The site uses Next.js i18n configuration with locale-based routing:
- **Supported locales**: `fr` (default), `en`, and `default`
- **Middleware** (`middleware.ts`): Handles locale detection and redirects users from the default locale to their preferred language (French by default, stored in `NEXT_LOCALE` cookie)
- **Locale structure**: All routes except API routes, `_next`, and public files are processed through the middleware
- When adding new pages, ensure they support the locale routing pattern

### Blog System

- **Data source**: Blog posts are stored in `data/index.ts` as static content (not a CMS)
- **Structure**: Each post has `id`, `title`, `description`, `content` (HTML string), `categories`, `author`, `publishedAt`, and `readTime`
- **Categories**: Defined in `data/index.ts` with color coding (SEO, Refonte, Tech, Next.js, Architecture, TypeScript)
- **Components**:
  - `blog-page.tsx`: Main blog interface with search and filtering
  - `blog-card.tsx`: Individual post preview cards
  - `search-bar.tsx`: Client-side search functionality
  - `category-filter.tsx`: Filter by category
- **Dynamic routes**: `app/blog/[id]/page.tsx` renders individual posts
- **Content format**: Blog content is HTML strings with inline images and semantic markup

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

1. Create the page in the appropriate `app/` subdirectory
2. Ensure it works with the i18n middleware
3. Add metadata for SEO
4. Update sitemap if needed
5. Test across locales

### Adding Blog Posts

1. Add the post object to `blogPosts` array in `data/index.ts`
2. Use a unique ID (kebab-case slug)
3. Assign relevant categories from the `categories` array
4. Include `readTime` estimate
5. Content should be HTML string with semantic markup
6. Images should be placed in `public/` and referenced with absolute paths

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
