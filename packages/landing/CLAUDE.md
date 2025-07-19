# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MemoCard is a Next.js-based static landing page for a flashcard application that uses spaced repetition for memory improvement. The site is available at memocard.org and supports multiple languages.

## Key Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes typecheck and HTML lang fix)
- `npm run build-and-serve` - Build and serve static files locally
- `npm run typecheck` - Validate TypeScript types
- `npm run prettier:fix` - Format all TS/TSX files
- `npm run lint` - Run Next.js linter

## Architecture Overview

### Multi-Language Support
The site uses Next.js App Router with separate routes for each locale:
- `/` - English (default)
- `/ru` - Russian
- `/es` - Spanish
- `/pt-br` - Portuguese (Brazil)
- `/uk` - Ukrainian

Each locale has its own `page.tsx` that imports the shared `MemocardPage` component and passes the appropriate language. Translations are centralized in `src/shared/translations.ts`.

### Static Site Generation
The project uses `next export` to generate a fully static site. After build, the `fix-html-lang.sh` script corrects HTML lang attributes for localized pages.

### Component Structure
- **Landing Page Components** (`src/components/landing-page/`): Main page sections like hero, features, plans
- **UI Components** (`src/components/ui/`): Reusable components following shadcn/ui patterns
- **Shared Resources** (`src/shared/`): Translations and external links

### Styling Approach
- Tailwind CSS with custom configuration
- Utility-first approach with `cn()` helper from `src/lib/utils.ts`

### Key Implementation Details
1. All external links are centralized in `src/shared/links.tsx`
2. Language switching is handled by `LanguageSwitcher` component
3. SEO optimization includes metadata, sitemaps, and language alternates
4. Google Analytics is integrated for production only
5. Font optimization uses Next.js font loading system