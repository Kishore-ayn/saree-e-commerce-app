# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run test` - Run Vitest tests once
- `npm run test:watch` - Run Vitest in watch mode for TDD
- `npm run fetch-sarees` - Fetch saree data from external source (see scripts/fetch-sarees.js)
- `npm run fetch-theme-images` - Fetch theme-related images (see scripts/fetch-theme-images.js)

## Code Architecture & Structure

This is a Next.js 16.2.10 project using the **App Router** (as indicated by the `app` directory). Key architectural aspects:

### Directory Structure
- `app/` - Contains all routes and UI components using Next.js App Router
  - `app/page.tsx` - Home page
  - `app/layout.tsx` - Root layout shared across all pages
  - `app/blog/[slug]/page.tsx` - Dynamic blog post route
  - `app/products/[slug]/page.tsx` - Individual product page
  - `app/collections/[slug]/page.tsx` - Collection listing page
  - `app/saree-shop/[area]/page.tsx` - Saree shop filtered by area
  - `app/about/page.tsx`, `app/contact/page.tsx` - Static pages
  - `app/admin/` - Admin dashboard (protected routes)
    - `app/admin/(auth)/` - Authentication routes (login)
    - `app/admin/(dashboard)/` - Admin dashboard routes protected by auth
      - CRUD interfaces for products, collections, areas, blogs, FAQs, testimonials, forms, pages, navigation, settings
- `public/` - Static assets (images, SVG icons, etc.)
- `scripts/` - Node.js scripts for data fetching and image processing
- `lib/` - Utility functions, CMS integration, and data access layers
  - `lib/cms/` - Server-only data access layer for Supabase integration
  - `lib/store.ts` - Zustand store for client state management
  - `lib/theme-images.ts` - Utilities for theme-related image processing
  - `lib/utils.ts` - General utility functions
  - `lib/schema.ts` - Zod schemas for data validation
  - `lib/types.ts` - TypeScript interfaces for data models
- `supabase/` - Database migrations and Supabase configuration
  - `supabase/migrations/` - SQL migrations for the CMS schema
  - `supabase/config.toml` - Supabase CLI configuration

### Key Technologies
- **Next.js 16** with App Router and Server Components
- **React 19** with ReactDOM
- **Tailwind CSS 4** for styling (configured via `tailwindcss` and `@tailwindcss/postcss`)
- **Zustand** for client-state management (`zustand` package)
- **Supabase** as the CMS/backend (`@supabase/supabase-js` and `@supabase/ssr`)
- **Lucide React** for icons
- **TypeScript** for type safety
- **Vitest** for testing

### Admin Panel (CMS)
The admin panel is located under `/app/admin` and uses Supabase for data storage. It provides:
- Authentication (login/logout)
- Dashboard overview
- Content management for:
  - Products (with variants, images, themes)
  - Collections (grouping of products)
  - Geographic areas (for filtering sarees by region)
  - Blog posts
  - Testimonials
  - FAQs
  - Custom pages and sections
  - Navigation menus
  - Site settings (SEO, business info, theme)

### CMS Architecture Details

#### Rendering Strategy
- Public site uses **statically generated** content with **on-demand revalidation** (ISR)
- Content-backed routes (`/products/[slug]`, `/collections/[slug]`, `/saree-shop/[area]`, `/blog/[slug]`) use `generateStaticParams()` to pre-render known content
- `export const dynamicParams = false` is relaxed to `true` (or omitted) so slugs created after the last build still render on first request and are cached
- Admin Server Actions call `revalidatePath()` or `revalidateTag()` after successful writes, making edits visible to visitors within seconds
- Anonymous traffic never hits the database directly; public pages are served from Next.js static/ISR cache

#### Data Access Layer
- A `lib/cms/` module provides server-only async functions with the same return shapes as the original data exports
- Return types use interfaces from `lib/types.ts` (Product, Collection, BlogPost, etc.)
- Page components become async to await these calls; JSX and prop shapes remain unchanged
- Example migration:
  ```ts
  // Before (hardcoded data)
  import { products } from "@/data/products";
  
  // After (CMS integration)
  import { getProducts } from "@/lib/cms/products";
  const products = await getProducts();
  ```

#### Authentication & Role-Based Access
- Authentication is handled via Supabase Auth (email/password) using `@supabase/ssr` for cookie-based sessions
- The `profiles` table includes a `role` enum (`admin`, `editor`, `viewer`)
- Role-Level Security (RLS) policies enforce authorization at the database layer
- **Admin route protection**: The admin dashboard layout (`app/admin/(dashboard)/layout.tsx`) is a server component that calls `getCurrentProfile()` from `lib/cms/auth` to verify the user's session and role. If the session is invalid or the user lacks sufficient permissions, it redirects to `/admin/login`. There is no root-level middleware; protection is implemented at the layout level.
- The `lib/cms/auth` module provides:
  - `verifySession()`: Validates the session and redirects to login if absent
  - `getCurrentProfile()`: Fetches the user's profile (including role) under RLS, used for role checks
  - Both functions are wrapped with React's `cache()` to prevent redundant requests during a render

#### Media Strategy
- Build-time images in `public/images/*` remain untouched (static site design assets)
- User-uploaded media via admin goes to **Supabase Storage**, tracked in a `media` table
- `next.config.ts` includes Supabase Storage hostname in `images.remotePatterns` to allow image optimization

#### Supabase Client Usage
- **Server Components & Actions**: Use `createClient()` from `lib/cms/supabase/server` which creates a per-request Supabase client bound to cookies (anon key)
- **Privileged Operations**: Use `createAdminClient()` from `lib/cms/supabase/admin` which creates a service-role client (bypasses RLS). This client must only be used in trusted server-side code after verifying the user has an admin role (via `requireAdmin()` in `lib/cms/users.ts`)

### Styling Approach
- Uses Tailwind CSS utility-first approach
- Global styles in `app/globals.css`
- Components follow shadcn/ui patterns (Radix-based components)
- Dark mode support via Tailwind's class strategy

### Data Fetching
- Server Components in `app/` directory fetch data directly using Supabase client via `lib/cms/` layer
- Admin actions use Supabase queries with server-side runtime
- Revalidation handled via custom revalidation script (see `lib/cms/revalidate-public.ts`)

## Important Notes

1. **Next.js Version**: This project uses Next.js 16.2.10 which has breaking changes from earlier versions. Refer to the Next.js documentation in `node_modules/next/dist/docs/` for version-specific APIs.
2. **Environment Variables**: Requires the following variables in `.env.local` (see `.env.local.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key (safe for client, used by `createClient`)
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for admin operations, server-only, used by `createAdminClient`)
3. **TypeScript**: Strict type checking is enabled. All new files should use `.ts` or `.tsx` extensions.
4. **Testing**: Uses Vitest. Test files are placed alongside source files with `.test.ts` or `.test.tsx` naming convention. Run tests with:
   - `npm run test` - Run all tests once
   - `npm run test:watch` - Run tests in watch mode for TDD
   - Individual test files can be run with `vitest run path/to/test-file.test.ts`
5. **Linting**: Uses ESLint with Next.js configuration (`eslint-config-next`).

## Common Tasks

### Adding a New Page
1. Create a new directory under `app/` for the route (e.g., `app/new-section/`)
2. Add a `page.tsx` file in that directory
3. Optionally add a `layout.tsx` if the section needs a different layout
4. Link to the page from navigation or elsewhere

### Adding Admin Functionality
1. Create a new directory under `app/admin/(dashboard)/` for the resource (e.g., `app/admin/(dashboard)/new-resource/`)
2. Add CRUD pages: `page.tsx` (list), `new/page.tsx` (create), `[id]/edit/page.tsx` (edit)
3. Implement actions in the corresponding `actions.ts` file (or create one if needed)
4. Add navigation item in the admin sidebar (likely in a layout or navigation component)

### Working with the CMS
1. To add a new content type to the CMS:
   - Create a migration in `supabase/migrations/` following the existing pattern
   - Add CRUD interfaces in `app/admin/(dashboard)/[resource]/`
   - Add data access functions in `lib/cms/[resource].ts`
   - Export the functions from `lib/cms/index.ts` for convenience (if exists)
2. To modify existing CMS functionality:
   - Updates to data structures require new migration files
   - Changes to admin UI go in `app/admin/(dashboard)/[resource]/`
   - Changes to data access go in `lib/cms/[resource].ts`

### Styling Components
- Use Tailwind utility classes directly in JSX
- For reusable components, consider creating them in a `components/` directory
- Follow the existing color scheme and spacing conventions from the admin panel and public site
- Refer to `app/globals.css` for CSS custom properties and base styles

## Database & Supabase Workflow

### Setting up Supabase (for new developers)
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link to project: `supabase link --project-ref [your-project-ref]`
4. Push local changes: `supabase db push`
5. Pull remote changes: `supabase db pull`

### Database Migrations
- All schema changes go through `supabase/migrations/` as SQL files
- Never edit the database directly; always create a migration
- Follow the naming pattern: `YYYYMMDDHHMMSS_description.sql`
- Refer to existing migrations for table structure and conventions

### Revalidation
- Content updates trigger revalidation via `lib/cms/revalidate-public.ts`
- The revalidation script can be run manually: `node lib/cms/revalidate-public.ts`
- Uses Supabase webhooks or manual calls to `revalidatePath()`/`revalidateTag()`