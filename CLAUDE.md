# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astrogon is a multipurpose static website template built with Astro JS, Tailwind CSS, and React. It provides a content-driven architecture with multiple pre-configured content collections (blog, docs, recipes, poetry, portfolio, etc.) that can be easily customized or extended.

## Development Commands

### Setup
- Install dependencies: `pnpm install`
- Node version: Use Node 22 (`nvm use 22` or `nvm install 22`)
- Package manager: This project uses pnpm (specified in `package.json`)

### Development
- Start dev server: `pnpm dev` (site runs at `http://localhost:4321`)
- Build for production: `pnpm build`
- Format code: `pnpm format`

### Cloudflare Deployment (Alternative)
- If deploying to Cloudflare Workers: `pnpm build && pnpm wrangler dev`
- Note: Starting with Astro 5.8, Node 18 is unsupported. Wrangler is needed for new Cloudflare Workers.

## Architecture Overview

### Routing & Data Flow Pattern

The project follows a strict architectural pattern to maintain separation of concerns:

1. **Content Layer** ([src/content/](src/content/))
   - All written content lives in content collections
   - Each collection has entries in Markdown/MDX format with frontmatter metadata
   - Schemas defined in [src/content.config.ts](src/content.config.ts)

2. **Pages Layer** ([src/pages/](src/pages/))
   - Defines site routing structure (file path = URL path)
   - **Exception**: Docs collection uses custom 2-level deep routing despite being stored deeper
   - Each page file references exactly ONE layout component
   - **Data querying happens here**: Pages call functions like `getEntries()` or `getIndex()` from [src/lib/contentParser.ts](src/lib/contentParser.ts)
   - Pages pass queried data down to layouts as props

3. **Components Layer** ([src/components/](src/components/))
   - `[collection]/` - Collection-specific layouts and components
     - `EntryLayout.astro` - Individual entry page structure
     - `CollectionLayout.astro` - Collection listing page structure
   - `common/` - Generic reusable components
     - `shortcodes/` - Components for use in MDX content files
   - `base/` - Base layout wrapping all pages ([BaseLayout.astro](src/components/base/BaseLayout.astro))

### TypeScript Path Aliases

Defined in [tsconfig.json](tsconfig.json):
- `@assets/*` → `./src/assets/*`
- `@components/*` → `./src/components/*`
- `@helpers/*` → `src/components/helpers/*`
- `@lib/*` → `src/lib/*`
- `@shortcodes/*` → `src/components/common/shortcodes/*`
- `@types/*` → `src/types/*`
- `@/*` → `./src/*`

### Content Collections System

Collections are defined in [src/content.config.ts](src/content.config.ts) using Astro's Content Collections API with the new Astro 5 glob loader pattern.

**Key patterns:**
- Files starting with `-` (e.g., `-index.md`) are index/collection-level content, filtered out from entry lists
- Files starting with `_` are templates, excluded by glob pattern `**\/[^_]*.{md,mdx}`
- Draft entries: Set `draft: true` in frontmatter to exclude from production

**Common collection schema features:**
- `searchable` base schema: Requires `title` and optional `description`, includes `draft` flag
- Author references: Use `reference("authors")` for cross-collection linking
- Auto-description: If `description` is missing and `autodescription: true`, generates from first N characters of content

**To add a new collection:**
1. Define schema in [src/content.config.ts](src/content.config.ts)
2. Add type to [src/types/index.d.ts](src/types/index.d.ts) if needed
3. Create directory under [src/content/](src/content/)
4. Create `EntryLayout.astro` and optionally `CollectionLayout.astro` in [src/components/[collection]/](src/components/)
5. Add routing in [src/pages/](src/pages/) to wire up data flow

### Utility Libraries

Key utility functions in [src/lib/](src/lib/):

- **contentParser.ts**: Core data retrieval functions
  - `getIndex(collection)` - Get the `-index` entry
  - `getEntries(collection, sortFn?, noIndex?, noDrafts?)` - Get all entries
  - `getEntriesBatch(collections, sortFn?, noIndex?, noDrafts?)` - Get entries from multiple collections
  - `getGroups(collection)` - Get top-level folders (2-segment paths ending in `-index`)
  - `getEntriesInGroup(collection, groupSlug, sortFn?)` - Get entries within a specific group

- **sortFunctions.ts**: Sorting utilities for collections
- **taxonomyFilter.ts** & **taxonomyParser.ts**: Category/tag filtering logic
- **similarItems.ts**: Related content algorithm (used for "Related Entries" sections)
- **readingTime.ts**: Calculate reading time from content
- **formatDate.ts**: Date formatting utilities

### Configuration Files

- **astro.config.mjs**: Astro configuration
  - Integrations: React, Sitemap, Tailwind, MDX
  - Markdown plugins: remark-toc, remark-collapse, remark-math, rehype-katex
  - Auto-imports configured for common components
  - Cloudflare adapter configured
  - Site base URL: Update `site` field for your domain

- **tailwind.config.js**: Tailwind configuration
  - Custom color schemes for light/dark modes
  - Glass effect utilities
  - Animation keyframes for intersect animations, twinkling stars, gradient cycling
  - Typography and form plugins enabled

### Special Features

**Search Functionality** ([src/pages/search.astro](src/pages/search.astro)):
- Uses Fuse.js for fuzzy search
- Post-build indexing via `pagefind` (runs in `postbuild` script)
- To make a collection searchable: extend `searchable` schema, add to `SearchableEntry` type, add to `searchableCollections` array

**Pagination**:
- Requires two route files: `[collection]/index.astro` and `[collection]/page/[slug].astro`
- Configure `entriesPerPage` in both files
- Uses `getStaticPaths()` for static generation

**MDX Shortcodes**:
- Auto-imported components available in all MDX files: Accordion, Notice, Youtube, Tabs, Tab, Button
- Supports LaTeX via KaTeX (inline and block math)
- Syntax highlighting via Shiki with light-plus/dark-plus themes

**Related Content**:
- Algorithm in [src/lib/similarItems.ts](src/lib/similarItems.ts)
- Compares taxonomies (categories, tags) to find similar entries
- Extend for additional metadata fields as needed

**Animations**:
- Intersection Observer-based animations in [src/components/base/ObserverScript.astro](src/components/base/ObserverScript.astro)
- CSS classes: `intersect:animate-fade`, `intersect:animate-fadeUp`, etc.
- Triggers: `intersect-full`, `intersect-half`, `intersect-quarter`, `intersect-repeat`, `intersect-no-queue`
- To remove animations: delete ObserverScript references, animation keyframes in tailwind.config.js, and `intersect:` classes

## Customization Notes

### Theme & Styling
- Color scheme: 7 main colors (14 with dark mode) defined in [tailwind.config.js](tailwind.config.js)
- Glass effect parameters in [src/styles/glass.css](src/styles/glass.css) - adjustable opacity, blur, borders
- Fonts: Stored in [public/fonts/](public/fonts/), loaded via [src/styles/fonts.css](src/styles/fonts.css)
- Background: Configured in [src/components/base/Background.astro](src/components/base/Background.astro) - includes examples for solid, gradient, image, and twinkling stars

### Navigation
- Header menu: Edit `menu` array in [src/components/base/Header.astro](src/components/base/Header.astro)
- Footer social links: Edit props in [src/components/base/Footer.astro](src/components/base/Footer.astro)

### Assets
- Images referenced from `public/` root, but stored in [src/assets/](src/assets/) using `@assets/*` alias
- Favicon: Multiple versions in [public/favicon/](public/favicon/) (use favicon.io generator)
- CNAME file in [public/CNAME](public/CNAME) must match deployment domain

## Development Workflow

1. **Content updates**: Edit files in [src/content/](src/content/) and [src/assets/](src/assets/)
2. **Styling changes**: Modify [tailwind.config.js](tailwind.config.js), [src/styles/](src/styles/), or inline Tailwind classes
3. **Structure changes**: Edit components in [src/components/](src/components/) or pages in [src/pages/](src/pages/)
4. **Schema changes**: Update [src/content.config.ts](src/content.config.ts) and corresponding TypeScript types

## Deployment

- **Netlify**: Configured via `netlify.toml`. Automatically detected by Netlify with pnpm support. Uses `pnpm build` command.
- **GitHub Pages**: Follow Astro's GitHub Pages deployment guide
- **Cloudflare Pages**: Recommended for advanced features, follow Astro's Cloudflare deployment guide
- Post-build: `pagefind` automatically indexes content for search functionality

## Important Notes

- Images in Astro use `@assets/*` paths, which resolve to [src/assets/](src/assets/), but Astro treats [public/](public/) as the root for static assets
- The `-index.md` pattern is used for collection index pages and is filtered out by `noIndex` parameter in `getEntries()`
- Draft content (`draft: true`) is filtered by default but can be included with `noDrafts = false`
- Tooltips work via the `title` attribute on any HTML element (powered by astro-tooltips)
- The stock content (text/images) is AI-generated/CC-licensed placeholder content meant to be replaced
