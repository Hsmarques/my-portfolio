# Prompt: Stack and deployment (Next.js or Astro, MDX, images, PWA)

Role: You are a solution architect and DX-focused engineer.

Context: Build a maintainable, fast photography + blog site with great authoring ergonomics.

Objectives
- Choose Next.js or Astro and set up the project with MDX, image optimization, and edge-first deployment.
- Establish CI/CD, performance budgets, and PWA basics.

Requirements
- Core stack
  - Pick Next.js or Astro; justify choice. Include routing for galleries, blog, and static pages.
  - MDX for blog and optional content components; Contentlayer or simple content loader.
  - Image optimization via chosen pipeline (from the image prompt) with `<picture>` helpers.
- Performance
  - SSG/ISR for galleries and posts; prefetch on hover; code-split and tree-shake.
  - Performance budgets in CI (Lighthouse CI/WebPageTest) with thresholds for LCP/INP/CLS and JS weight.
- PWA & accessibility
  - Manifest, icons, service worker (offline for recent pages), safe fallbacks.
  - Security headers (CSP, HSTS) and basic error monitoring.
- DX & deployment
  - One-command local dev; lint/format/test.
  - Deploy to Vercel/Netlify with edge caching; environment variables documented.

Deliverables
- Repository scaffold with routes, layouts, MDX, image helper, and example content.
- CI config, performance testing setup, and deployment configuration.
- Documentation: how to author posts/galleries, add images, and deploy.

Acceptance criteria
- Fresh clone runs with one command; production deploy under 5 minutes.
- Core Web Vitals in CI meet thresholds on example pages.
- PWA installable; offline works for last-viewed galleries and posts.