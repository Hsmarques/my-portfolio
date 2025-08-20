# Agent Guidelines for Portfolio Project

## Git Workflow
- **ALWAYS** create a new branch for any code changes: `git checkout -b feature/description`
- **ALWAYS** commit and push after making changes
- Never work directly on main branch
- Branch naming: `feature/`, `fix/`, `enhance/` prefixes

## Commands
- **Dev**: `npm run dev` (or `pnpm dev`)
- **Build**: `npm run build` (includes photo manifest generation)
- **Generate photos**: `npm run generate:photos-manifest`
- **Optimize photos**: `npm run optimize:photos`
- **No tests defined** - use TypeScript compiler for validation

## Tech Stack
- **Framework**: SolidJS with @solidjs/start (file-based routing)
- **Styling**: TailwindCSS with custom accent colors (camel theme)
- **Build**: Vinxi bundler
- **Path alias**: `~/` maps to `./src/`

## Code Style
- **Imports**: Framework imports first, then local components/libs
- **Types**: Explicit TypeScript with strict mode, use `type` imports
- **Functions**: Default exports for pages/components, named exports for utilities
- **Props**: Use interface/type definitions like `{ photos: Photo[] }`
- **Signals**: Use createSignal, createMemo, createResource patterns
- **Event handlers**: Arrow functions with explicit types (e.g., `(e: KeyboardEvent)`)
- **SSR safe**: Always check `typeof window !== 'undefined'` for client-only code
- **Accessibility**: Include ARIA labels and keyboard navigation
- **Performance**: Use lazy loading, draggable={false}, prevent context menus on images