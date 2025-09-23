# Copilot Instructions for KING Portfolio

## Project Overview
Modern portfolio site for KING branding studio built with React, TypeScript, Vite, and Tailwind CSS. Currently transitioning from static portfolio data to a dynamic Supabase-backed management system.

## Key Architecture Patterns

### Portfolio Data Structure
- Case studies defined in `src/data/caseStudies.ts`
- Each case study has:
  ```typescript
  type CaseStudy = {
    slug: string;
    title: string;
    client?: string;
    category: "Branding" | "Logo" | "Poster" | "Other";
    tagline: string;
    cover: string;
    fullImage?: string;
    year: string;
    sections: CaseBlock[];
    isMultiplePartners?: boolean;
    partners?: Partner[];
    singlePartner?: { type: string };
  }
  ```

### Partner System
Two partner display modes (`src/components/case-study/`):
1. **SinglePartnerHeader**: Simple "Follow" button with type text (e.g., "By KING")
2. **MultiplePartnersHeader**: "Follow All" dropdown showing collaborating brands

### UI Component Hierarchy
1. Use existing UI components from `src/components/ui/*` first
2. Layout components in `src/components/layout/*`
3. Page sections in `src/components/sections/*`
4. Follow shadcn/ui patterns and Tailwind configuration

## Current Architecture Migration
Transitioning from static to dynamic portfolio management:

### Database Schema (Supabase)
```sql
-- Portfolio items table
create table portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  title text,
  description text,
  media_url text,
  media_type text,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User roles table
create table roles (
  user_id uuid references auth.users(id) primary key,
  is_admin boolean default false,
  is_moderator boolean default false,
  is_worker boolean default false
);
```

### Key Files for Portfolio Features
- `src/pages/Portfolio.tsx`: Main portfolio grid view
- `src/pages/CaseStudy.tsx`: Individual case study display
- `src/components/sections/PortfolioGrid.tsx`: Portfolio item grid
- `src/components/portfolio/PortfolioItem.tsx`: Individual portfolio card

## Development Workflow
1. Follow TypeScript standards - no `any`, explicit types
2. Use existing components via composition before creating new ones
3. Maintain consistent file structure and naming conventions
4. Keep data fetching aligned with existing patterns

## Common Tasks

### Adding New Portfolio Fields
1. Update Supabase schema
2. Extend TypeScript types in `src/types/portfolio.ts`
3. Update UI components to handle new fields
4. Add migration for existing data if needed

### Implementing Role-Based Access
1. Check user role on protected routes/components
2. Apply RLS policies in Supabase
3. Use role-specific UI components/actions

### Media Handling
1. Use Supabase Storage for uploads
2. Support image formats: .png, .jpg, .webp, .gif
3. Support video formats: .mp4, .mov, .webm
4. Handle media optimization and preview generation

## Key Principles
1. **Component Reuse**: Always check existing components first
2. **Type Safety**: Maintain strict TypeScript usage
3. **Accessibility**: Follow a11y best practices
4. **Performance**: Optimize media and data loading
5. **Security**: Enforce role-based access control

## Getting Help
- Check `.cursorrules` for component creation guidelines
- Review existing implementations in similar features
- Follow TypeScript patterns from surrounding code
- Maintain consistent code style with project