# AGENTS.md

A guide for AI coding agents working on the MK-Web project.

## Project Overview

MK-Web is a multilingual (French/English) freelance web developer portfolio built with Next.js 16 App Router, TypeScript, and Tailwind CSS. The site features a blog system, project estimation forms, contact forms, portfolio showcase, and a protected admin dashboard for content management.

**Key URLs:**

- Production: https://www.mk-web.fr
- Default locale: French (fr)
- Supported locales: `fr`, `en`

## Setup Commands

- Install dependencies: `bun install`
- Start dev server: `bun dev` (runs on port 3300)
- Build for production: `bun run build`
- Start production server: `bun run start`
- Run linter: `bun run lint`
- Format code: `bun run format`

## Code Style

- **TypeScript:** Strict mode enabled (`strict: true` in tsconfig.json)
- **Quotes:** Use double quotes for JSX attributes, single quotes for strings (Prettier will handle this)
- **Semicolons:** Use semicolons (Prettier default)
- **Imports:** Use path aliases (`@/components`, `@/utils`, etc.)
- **Components:** Use functional components with TypeScript
- **File naming:** PascalCase for components (`Navbar.tsx`), kebab-case for utilities (`send-mail.ts`)

## Project Structure

- `app/[locale]/` - All routes are locale-prefixed (except API routes and admin)
- `app/admin/` - Protected admin dashboard routes (authentication required)
- `app/api/admin/` - Protected API routes for admin CRUD operations
- `components/` - React components (use `ui/` for Shadcn components)
- `components/admin/` - Admin-specific components
- `content/blog/{locale}/` - MDX blog posts organized by locale
- `locales/dictionaries/` - Translation JSON files (includes `admin` section)
- `lib/` - Utility libraries (MDX processing, auth, database, etc.)
- `lib/db/` - Database schema and connection (Drizzle ORM)
- `utils/` - Helper functions
- `types/` - TypeScript type definitions
- `scripts/` - Utility scripts (e.g., `seed.ts` for user seeding)

## Internationalization (i18n)

- **Always support both locales:** `fr` (default) and `en`
- **Dictionary files:** `locales/dictionaries/{locale}.json`
- **Locale routing:** All pages under `app/[locale]/` (except admin routes)
- **Admin translations:** Admin uses default locale (`fr`) via `AdminDictionaryProvider`
- **When adding new text:** Add translations to both `en.json` and `fr.json` under the `admin` section
- **Locale detection:** Use `isValidLocale()` from `@/locales/i18n`
- **Dictionary access:**
  - Server components: Use `getDictionary(locale)` from `@/locales/dictionaries`
  - Client components in admin: Use `useAdminDictionary()` hook from `@/components/admin/AdminDictionaryProvider`
- **Admin dictionary structure:** All admin text is under `dict.admin.*` (auth, dashboard, blogs, projects, common)

## Component Guidelines

- **Client components:** Mark with `'use client'` directive
- **Server components:** Default (no directive needed)
- **Forms:** Use React Hook Form with Zod validation
- **UI components:** Use Shadcn UI components from `components/ui/`
- **Styling:** Tailwind CSS utility classes
- **Brand colors:** `myorange-100` (#FF4A17) and `myorange-200` (#E33200)
- **Animations:** Use Framer Motion for complex animations
- **Accessibility:** Always include ARIA labels, keyboard navigation support

## Blog System

### Public Blog (MDX-based)

- **Blog posts:** MDX files in `content/blog/{locale}/*.mdx`
- **Frontmatter required:**
  ```yaml
  title: 'Post Title'
  description: 'Post description'
  categories: ['seo', 'tech']
  author: 'Author Name'
  publishedAt: '2024-01-01'
  readTime: 5
  image: '/path/to/image.png'
  ```
- **Categories:** Defined in `data/index.ts`
- **Functions:** Use `getAllBlogPosts(locale)` and `getBlogPostById(id, locale)` from `@/lib/mdx`
- **Always create posts in both locales** or document which locale is supported

### Admin Blog Management (Database-based)

- **Location:** `/admin/blogs`
- **Database table:** `blog` in `lib/db/schema.ts`
- **Fields:** `id`, `title`, `slug`, `description`, `content` (Markdown), `status` (draft/published), `createdAt`, `updatedAt`
- **CRUD operations:** Full create, read, update, delete via admin interface
- **Markdown editor:** Uses `@uiw/react-md-editor` for content editing
- **Rendering:** Markdown is sanitized with DOMPurify before display
- **API routes:** `/api/admin/blogs` (GET, POST) and `/api/admin/blogs/[id]` (GET, PUT, DELETE)

## Forms & Validation

- **Form library:** React Hook Form
- **Validation:** Zod schemas
- **Resolver:** `@hookform/resolvers/zod`
- **reCAPTCHA:** Required for contact and estimation forms (use `next-recaptcha-v3`)
- **Email sending:** Use `sendMail()` from `@/utils/send-mail.ts`
- **Error handling:** Show toast notifications using `react-hot-toast`

## API Routes

- **Location:** `app/api/`
- **OG Images:** `/api/og` generates dynamic Open Graph images
- **Server actions:** Use `"use server"` directive
- **Edge runtime:** Use `export const runtime = 'edge'` when appropriate

## Styling Guidelines

- **Framework:** Tailwind CSS
- **Custom colors:** Use `myorange-100` and `myorange-200` for brand colors
- **Dark mode:** Supported via `next-themes` (ensure components work in both themes)
- **Typography:** Use `@tailwindcss/typography` for MDX content
- **Responsive:** Mobile-first approach
- **Animations:** Use Tailwind utilities or Framer Motion

## Testing & Quality

- **Before committing:** Run `bun run lint` and fix all errors
- **Type checking:** TypeScript strict mode catches most issues
- **Format code:** Run `bun run format` before committing
- **ESLint rules:** No unused variables, allow unescaped entities in React

## Environment Variables

**Required:**

- `SMTP_SERVER_HOST` - SMTP server address
- `SMTP_SERVER_USERNAME` - SMTP username
- `SMTP_SERVER_PASSWORD` - SMTP password
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key
- `DATABASE_URL` - PostgreSQL database connection string (for Drizzle)
- `BETTER_AUTH_SECRET` - Secret key for Better Auth (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Base URL of your application (e.g., `https://www.mk-web.fr`)

**Optional:**

- `GTM_ID` - Google Tag Manager ID
- `REPLICATE_API_KEY` - For future AI features
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token (if using)
- `KV_*` - Vercel KV variables (if using)

**Access:** Use `process.env.VARIABLE_NAME` or create utilities in `utils/env.ts`

## Common Patterns

### Creating a New Page

1. Create file in `app/[locale]/your-page/page.tsx`
2. Get dictionary: `const dict = await getDictionary(locale as Locale)`
3. Add translations to both `en.json` and `fr.json`
4. Generate metadata in `layout.tsx` or page file
5. Ensure locale validation with `isValidLocale()`

### Adding a New Component

1. Create in `components/YourComponent.tsx`
2. If using client features, add `'use client'`
3. Accept `dict` prop for translations if needed
4. Use TypeScript interfaces for props
5. Follow accessibility guidelines

### Working with Blog Posts

1. Create MDX file in `content/blog/{locale}/post-name.mdx`
2. Include all required frontmatter fields
3. Use valid category IDs from `data/index.ts`
4. Test with `getAllBlogPosts(locale)` and `getBlogPostById()`

### Form Implementation

1. Create Zod schema for validation
2. Use React Hook Form with `useForm()`
3. Integrate reCAPTCHA with `useReCaptcha()`
4. Call `sendMail()` server action
5. Show success/error toasts

## Security Considerations

- **Always validate:** Server-side validation for all inputs
- **reCAPTCHA:** Required for all form submissions
- **Email:** Verify SMTP connection before sending
- **Environment variables:** Never commit secrets
- **Rate limiting:** Consider using `@upstash/ratelimit` for API routes

## SEO Guidelines

- **Metadata:** Always set locale-aware metadata
- **Open Graph:** Use `/api/og` for dynamic OG images
- **Sitemap:** Blog posts are auto-included in `app/sitemap.ts`
- **Canonical URLs:** Include in metadata with locale alternates
- **Structured data:** Add when appropriate

## Deployment

- **Platform:** Private VPS with Coolify
- **Build output:** Standalone mode
- **Docker:** Dockerfile included for containerized deployment
- **Environment:** Set all required env vars in Coolify dashboard
- **Database:** PostgreSQL database (managed via Coolify or external provider)
- **Runtime:** Bun runtime (configured in Coolify)

## Important Notes

- **App Router only:** No Pages Router, all routes use App Router
- **Locale prefix:** All routes except API routes and admin routes are locale-prefixed
- **MDX content:** Public blog posts are file-based in `content/blog/{locale}/`
- **Database content:** Admin-managed blogs and projects are stored in PostgreSQL
- **Package manager:** Use `bun` (Bun runtime and package manager)
- **Next.js version:** 16.1.1 (App Router features)
- **React version:** 19.2.3
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth integrated with Drizzle
- **Admin locale:** Admin dashboard uses default locale (`fr`) via `AdminDictionaryProvider`
- **Markdown security:** Always sanitize HTML output with DOMPurify, never render raw Markdown as HTML

## When Making Changes

1. **Check locale support:** Ensure changes work for both `fr` and `en`
2. **Update translations:** Add new strings to both dictionary files (`en.json` and `fr.json`)
   - For admin text: Add under `admin.*` section
   - For public text: Add under appropriate section (nav, hero, blog, etc.)
3. **Run linter:** `bun run lint` before committing
4. **Format code:** `bun run format` before committing
5. **Test forms:** Verify reCAPTCHA and email sending work
6. **Check accessibility:** Keyboard navigation, ARIA labels, focus management
7. **Verify responsive:** Test on mobile and desktop viewports
8. **Database changes:** Run migrations with `bun run db:generate` then `bun run db:push` (dev) or `bun run db:migrate` (production)
9. **Admin changes:** Ensure all admin text uses dictionary via `useAdminDictionary()` hook
10. **Markdown security:** Always use `MarkdownRenderer` component which handles DOMPurify sanitization

## Common Issues & Solutions

- **Locale not found:** Use `isValidLocale()` and provide fallback to `'fr'`
- **Translation missing:** Check both `en.json` and `fr.json` files, ensure admin text is under `admin.*` section
- **MDX not rendering:** Ensure frontmatter is valid YAML
- **Form not submitting:** Check reCAPTCHA token and SMTP configuration
- **Type errors:** Ensure all props are properly typed with TypeScript interfaces
- **Admin auth errors:** Ensure `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are set in environment
- **Database connection errors:** Verify `DATABASE_URL` is correct PostgreSQL connection string
- **Dictionary not found in admin:** Ensure component is wrapped in `AdminDictionaryProvider` and uses `useAdminDictionary()` hook
- **Markdown XSS concerns:** Always use `MarkdownRenderer` component, never render raw Markdown as HTML

## Authentication & Database

### Better Auth + Drizzle Integration

- **Auth library:** Better Auth (https://www.better-auth.com/)
- **ORM:** Drizzle ORM (https://orm.drizzle.team/)
- **Database:** PostgreSQL
- **Schema location:** `lib/db/schema.ts`
- **Auth config:** `lib/auth.ts`
- **Database connection:** `lib/db/index.ts`
- **Client auth:** `lib/auth-client.ts`
- **Auth utilities:** `lib/auth-utils.ts` (server-side session management)

### Admin Authentication

- **Login page:** `/admin/login` - Email/password authentication
- **Signup page:** `/admin/signup` - User registration
- **Protected routes:** All `/admin/*` routes require authentication via `requireAuth()` in layout
- **Session management:** Automatic via Better Auth
- **Auth middleware:** Use `requireAuth()` from `@/lib/auth-utils` in server components/API routes

### Quick Setup

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Set up environment variables:**
   - Copy `.example.env` to `.env`
   - Set `DATABASE_URL` (PostgreSQL connection string)
   - Generate `BETTER_AUTH_SECRET`: `openssl rand -base64 32`
   - Set `BETTER_AUTH_URL` (your app URL)

3. **Run database migrations:**

   ```bash
   bun run db:generate  # Generate migration files from schema
   bun run db:push      # Push schema to database (dev)
   # OR
   bun run db:migrate   # Apply migrations (production)
   ```

4. **Start development server:**
   ```bash
   bun dev
   ```

### Database Setup

- **Schema:** Defined in `lib/db/schema.ts`
- **Better Auth tables:** Already included (user, session, account, verification)
- **Custom tables:** Add below the Better Auth tables in schema.ts
- **Connection:** Configured in `lib/db/index.ts` using `DATABASE_URL`
- **Migrations:** Use `drizzle-kit` commands (see scripts in package.json)

### Better Auth Configuration

- **Auth instance:** Created in `lib/auth.ts`
- **API routes:** Auto-generated at `/api/auth/*` via `app/api/auth/[...all]/route.ts`
- **Client usage:** Import from `lib/auth-client.ts`
- **Server usage:** Import `auth` from `lib/auth.ts`
- **Session management:** Handled automatically by Better Auth

### Common Auth Patterns

**Client-side (React):**

```typescript
import { signIn, signUp, signOut, useSession } from '@/lib/auth-client';

// In a component
const { data: session, isPending } = useSession();

// Sign in
await signIn.email({
  email: 'user@example.com',
  password: 'password',
});

// Sign up
await signUp.email({
  email: 'user@example.com',
  password: 'password',
  name: 'User Name',
});

// Sign out
await signOut();
```

**Server-side (API routes/Server Components):**

```typescript
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Get session
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  // User not authenticated
}
```

**Server Actions:**

```typescript
'use server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
```

### Database Queries

- **Use Drizzle ORM:** Import `db` from `lib/db`
- **Type-safe queries:** Full TypeScript support with schema inference
- **Example query:**

  ```typescript
  import { db } from '@/lib/db';
  import { blog } from '@/lib/db/schema';
  import { eq, desc } from 'drizzle-orm';

  const blogs = await db
    .select()
    .from(blog)
    .where(eq(blog.status, 'published'))
    .orderBy(desc(blog.createdAt));
  ```

- **Relations:** Define in schema with `relations()` function
- **Migrations:** Always generate migrations for schema changes with `bun run db:generate`

### Database Models

**Blog Table (`blog`):**

- `id` (text, primary key, CUID2)
- `title` (text, required)
- `slug` (text, required, unique)
- `description` (text, optional)
- `content` (text, required) - Markdown content
- `status` (enum: 'draft' | 'published', default: 'draft')
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Project Table (`project`):**

- Same structure as blog table
- Used for project portfolio management

**User Tables (Better Auth):**

- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth/password accounts
- `verification` - Email verification tokens

### Database Scripts

- `bun run db:generate` - Generate migration files from schema changes
- `bun run db:push` - Push schema directly to database (development only)
- `bun run db:migrate` - Apply pending migrations (production)
- `bun run db:studio` - Open Drizzle Studio (database GUI)

## Admin Dashboard

### Overview

The admin dashboard is a protected content management system for managing blogs and projects. All admin routes require authentication.

### Admin Routes

- `/admin/login` - Login page (public)
- `/admin/signup` - Signup page (public)
- `/admin/dashboard` - Main dashboard with statistics (protected)
- `/admin/blogs` - Blog list page (protected)
- `/admin/blogs/new` - Create new blog (protected)
- `/admin/blogs/[id]` - View blog (protected)
- `/admin/blogs/[id]/edit` - Edit blog (protected)
- `/admin/projects` - Project list page (protected)
- `/admin/projects/new` - Create new project (protected)
- `/admin/projects/[id]` - View project (protected)
- `/admin/projects/[id]/edit` - Edit project (protected)

### Admin Components

- `components/admin/AdminSidebar.tsx` - Sidebar navigation
- `components/admin/AdminTopbar.tsx` - Topbar with user menu
- `components/admin/UserMenu.tsx` - User dropdown menu
- `components/admin/MarkdownEditor.tsx` - Markdown editor wrapper
- `components/admin/DashboardStats.tsx` - Dashboard statistics
- `components/admin/AdminDictionaryProvider.tsx` - Dictionary context provider
- `components/admin/LoginForm.tsx` - Login form component
- `components/admin/SignupForm.tsx` - Signup form component

### Admin API Routes

All admin API routes are protected with `requireAuth()`:

- `GET /api/admin/blogs` - List blogs (with pagination and status filter)
- `POST /api/admin/blogs` - Create blog
- `GET /api/admin/blogs/[id]` - Get single blog
- `PUT /api/admin/blogs/[id]` - Update blog
- `DELETE /api/admin/blogs/[id]` - Delete blog
- `GET /api/admin/projects` - List projects (with pagination and status filter)
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects/[id]` - Get single project
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Markdown Editor & Security

- **Editor:** `@uiw/react-md-editor` - Full-featured Markdown editor
- **Rendering:** `lib/markdown.tsx` - Secure Markdown renderer component
- **Sanitization:** DOMPurify sanitizes HTML output before rendering
- **Security rules:**
  - ✅ Markdown content is stored as-is in database
  - ✅ HTML output is always sanitized with DOMPurify
  - ❌ Scripts, inline JS, and unsafe attributes are blocked
  - ✅ Common Markdown features allowed (headings, lists, links, code blocks, images)

### User Seeding

- **Script:** `scripts/seed.ts`
- **Command:** `bun run db:seed`
- **Creates:** Admin user (`admin@mk-web.fr`) and test user (`test@mk-web.fr`)
- **Note:** Users are created via Better Auth API, passwords must be set through signup or manually

### Admin Translations

All admin text is localized in `locales/dictionaries/{locale}.json` under the `admin` key:

- `admin.auth.*` - Authentication text (login, signup, signout)
- `admin.dashboard.*` - Dashboard text and statistics
- `admin.sidebar.*` - Sidebar navigation labels
- `admin.blogs.*` - Blog management text
- `admin.projects.*` - Project management text
- `admin.common.*` - Common admin UI text

**Usage in client components:**

```typescript
import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';

const dict = useAdminDictionary();
const t = dict.admin.blogs; // Access blog translations
```

## Getting Help

- **Constants:** Check `utils/consts.ts` for app-wide constants
- **Types:** Check `types/index.ts` for shared type definitions
- **Utilities:** Check `lib/` and `utils/` for helper functions
- **Components:** Check `components/ui/` for reusable UI components
- **Database:** Check `lib/db/` for database schema and connection
- **Auth:** Check `lib/auth.ts` for Better Auth configuration
- **Admin:** Check `components/admin/` for admin components and `app/admin/` for admin pages
