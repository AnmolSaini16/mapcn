# AGENTS.md

## Project Overview

**mapcn** is a free, open-source library of ready-to-use, customizable map components for React. Built on [MapLibre GL](https://maplibre.org/), styled with [Tailwind CSS](https://tailwindcss.com/), works seamlessly with [shadcn/ui](https://ui.shadcn.com/).

The repo serves dual purpose: the core map component registry (`src/registry/`) and the documentation site at [mapcn.dev](https://mapcn.dev).

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Map Engine**: MapLibre GL JS v6
- **Fonts**: Geist (sans) + Geist Mono
- **Code Highlighting**: Shiki (dual light/dark theme)
- **Registry**: shadcn CLI for building distributable components

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, metadata, providers)
│   ├── (main)/                       # Main layout group (header + content)
│   │   ├── layout.tsx                # Header wrapper
│   │   ├── (home)/                   # Landing page
│   │   │   └── _components/          # Homepage examples grid
│   │   ├── docs/                     # Documentation pages
│   │   │   └── _components/          # Docs layout, sidebar, TOC, code blocks
│   │   └── blocks/                   # Full-page block demos
│   └── (view)/                       # Standalone block viewer
├── components/                       # Shared app components (header, footer, logo, nav)
│   └── ui/                           # shadcn/ui primitives
├── registry/                         # Core map components (the library itself)
│   ├── map.tsx                       # Main map component + all sub-components
│   └── blocks/                       # Full-page block examples
├── lib/                              # Utilities, navigation config, helpers
└── styles/
    └── globals.css                   # Theme tokens, animations, base styles
```

## Key Conventions

### Components

- Use functional components with named exports
- Prefer React Server Components; use `"use client"` only when Web APIs are needed
- Structure files: exported component → subcomponents → helpers → static content → types
- Use `cn()` from `@/lib/utils` for conditional class merging

### Styling

- Tailwind utility classes only — no CSS modules, no styled-components
- Mobile-first responsive design
- Theme tokens defined as CSS custom properties in `globals.css` (oklch color space)
- No hardcoded colors — always use semantic tokens (`foreground`, `muted-foreground`, `border`, etc.)

### Registry (`src/registry/`)

- `map.tsx` is the single-file component library containing Map, Marker, Popup, Route, Controls, etc.
- Blocks live in `src/registry/blocks/` — each block is a self-contained page component
- Registry is built via `npm run registry:build` using the shadcn CLI

### Naming

- Directories: lowercase with dashes (`docs-sidebar`, `block-preview`)
- Components: PascalCase exports (`DocsLayout`, `PageHeader`)
- Files: kebab-case (`command-search.tsx`, `page-header.tsx`)

### Navigation

- All site navigation is centralized in `src/lib/site-navigation.ts`
- Docs sidebar nav uses `docsNavigation`, command search uses `siteNavigation`

## Design System

- Minimal, content-first aesthetic - no visual noise, no unnecessary borders/shadows/decoration
- Color palette is monochrome (grayscale oklch)
- Generous, consistent white space; let layouts breathe rather than packing elements tightly
- Clear typographic hierarchy - Geist Sans for UI/prose, Geist Mono for code/labels; use size, weight, and muted-foreground (not color) to establish hierarchy
- Header: sticky, backdrop-blur, gradient bottom border
- Footer: gradient top border matching header

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run registry:build   # Build distributable registry to public/r/
```
