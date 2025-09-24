# Prompt: Make the photos the product (homepage, lightbox, galleries)

Role: You are a senior web engineer and UX designer specializing in high-performance photography websites.

Context: This is a personal photography site with optional blog. Primary goal is to showcase photos beautifully and quickly, with simple paths to contact, prints, and licensing.

Primary objectives
- Build a curated “Best of” homepage grid (12–18 images) with a single-line value proposition and a primary CTA.
- Implement an immersive, accessible lightbox with zoom/pan, keyboard/swipe navigation, filmstrip thumbnails, EXIF toggle, deep links, and optional Buy/License actions.
- Create thematic galleries (e.g., Portraits, Travel, Street, Editorial) with short story context; add an optional map view when GPS metadata exists.

Requirements
- Homepage
  - Above-the-fold: one bold headline, brief proof subtext, primary CTA button (e.g., View Work / Contact).
  - Curated grid uses art-directed crops per breakpoint, consistent gutters, and responsive image sources.
  - No carousel. Keep the hero fast, static, and readable.
- Lightbox
  - Keyboard: ArrowLeft/Right (prev/next), Escape (close), Enter/Space (toggle UI), +/- or pinch to zoom.
  - Touch: swipe left/right, pinch/zoom, double-tap to zoom, drag to pan.
  - Accessibility: focus trap, descriptive labels, aria-live for slide changes, ESC-close, visible focus, 44px+ targets.
  - UI: caption, optional EXIF toggle (f-stop, shutter, ISO, lens), share (copy link), filmstrip, Buy print / License buttons when enabled.
  - Deep-linking: `?image=<id>` or `#image-<slug>` opens directly to the image; preserves scroll position and back/forward behavior.
  - Performance: prefetch next/prev images; memory-safe zooming; avoid layout shift.
- Galleries
  - Route per gallery (e.g., /work/portraits) with title, short intro text, grid, and lightbox integration.
  - Optional map view: uses GPS from EXIF or frontmatter; clusters markers; clicking marker opens the image/lightbox.
  - Gallery metadata managed via MD/MDX frontmatter or a simple content manifest (JSON/YAML).
- Content management
  - Each image has: id/slug, title, caption, alt text, EXIF (optional), tags, gallery assignment, print/licensing flags.
  - Provide a simple seed content structure and a script to validate metadata.
- Design
  - Neutral, low-contrast UI chrome; images on neutral background; respect prefers-reduced-motion.
  - Mobile-first with fluid spacing and generous tap targets.

Deliverables
- Pages/routes: homepage, gallery index, gallery detail routes, optional map view.
- Components: CuratedGrid, Lightbox, Filmstrip, ExifPanel, GalleryHeader, GalleryGrid, MapGallery (optional).
- Content: sample galleries (3+), 18+ curated images, example captions/alt.
- Documentation: how to add new images/galleries, how to control curation order.
- Tests: unit tests for lightbox controls and accessibility checks; basic E2E flows (open lightbox, navigate, deep-link).

Acceptance criteria
- Homepage LCP <= 1.8s on a mid-tier mobile device; no CLS > 0.1.
- Lightbox fully keyboard accessible, focus-trapped, with ARIA labels and compliant color contrast.
- Deep-linking into specific images works across homepage and galleries; browser back/forward behaves intuitively.
- Galleries render responsively with correct art direction and no layout shifts; map view (if present) loads progressively.
- All images include meaningful alt text; EXIF panel hides when data unavailable.

Notes and constraints
- Use responsive images and placeholders from the image pipeline (handled by a separate prompt).
- Prefer progressive enhancement; page content should be usable without JS (minus lightbox zoom/swipe).
- Keep total JS added by the lightbox under ~30–40 KB gzipped if possible.