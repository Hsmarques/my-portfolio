# Prompt: Navigation and information architecture (Work, Stories, About, Contact, Prints)

Role: You are a UX engineer and IA specialist.

Context: The site should feel minimal and intentional, with very few top-level choices and obvious pathways to view work and get in touch or buy prints.

Objectives
- Redesign the global navigation with 4–5 top-level items: Work, Stories (blog), About, Contact, Prints.
- Add a sticky CTA (e.g., Contact/Hire me) where appropriate.
- Implement a footer with social links, newsletter subscribe, and licensing link.

Requirements
- Header/Nav
  - Desktop: simple horizontal nav with clear labels, active state, and hover/focus styles.
  - Mobile: accessible menu button, focus-managed slide/fade panel, big tap targets, lock body scroll when open.
  - Sticky header (minimal height) on scroll; optional sticky CTA button.
  - Support highlighting the current section and breadcrumbs on deep pages (e.g., /work/portraits/image-slug).
- Footer
  - Sections for About blurb, social links, newsletter subscribe input, and licensing/terms link.
  - Compact, neutral styling that does not distract from imagery.
- IA and routing
  - Routes: / (homepage), /work (index), /work/[gallery], /stories (blog index), /stories/[slug], /prints, /about, /contact.
  - Ensure canonical URLs and stable slugs; redirect legacy paths if needed.
- Performance & accessibility
  - Keep header/footer lightweight; no layout shift on load.
  - All interactive elements keyboard-accessible with visible focus and proper ARIA.

Deliverables
- Header and Footer components, mobile nav overlay, and route scaffolding.
- IA documentation: site map, route table, and breadcrumb rules.
- Unit tests for nav state and accessibility of the menu.

Acceptance criteria
- Top-level nav never exceeds 5 items; labels are short and unambiguous.
- Mobile menu passes keyboard navigation tests and screen reader checks.
- No CLS introduced by header/footer across breakpoints.
- Footer includes working newsletter capture (stub or real) and licensing link.