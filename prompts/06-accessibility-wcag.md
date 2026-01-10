# Prompt: Accessibility (WCAG 2.2 AA) for a photography + blog site

Role: You are an accessibility engineer and UX specialist.

Context: Photo-forward personal site with galleries, lightbox, and MDX blog. Ensure equitable access for keyboard, screen reader, and motion-sensitive users.

Objectives
- Achieve WCAG 2.2 AA compliance across pages and interactive components (nav, lightbox, forms, menus).
- Provide an alt text authoring and review workflow; ensure captions are readable and meaningful.

Requirements
- Semantics & structure
  - Correct landmarks (`header`, `nav`, `main`, `footer`), headings in order, list semantics for grids where appropriate.
  - Provide skip links and visible focus outlines with sufficient contrast.
- Keyboard support
  - All interactive elements reachable in logical order; no keyboard traps.
  - Lightbox: focus trap, ESC to close, arrow keys to navigate, Enter/Space to toggle controls.
- Screen reader support
  - Descriptive `aria-label`/`aria-labelledby`, alt text policy for images (decorative images marked appropriately).
  - Announce slide changes in the lightbox (`aria-live`/`role="status"`).
- Motion & vision
  - Respect `prefers-reduced-motion`; avoid parallax/auto-anim unless reduced.
  - Maintain color contrast AA; support zoom to 200–400% without loss of functionality.
- Forms
  - Explicit `<label>`s, helpful error messages, inline validation, programmatic success/failure alerts.
- Media
  - Captions align with photos; EXIF info accessible and not solely conveyed by color.

Deliverables
- Accessibility checklist and audit report with prioritized fixes.
- Implemented fixes in navigation, lightbox, galleries, blog templates, and forms.
- Automated checks (axe/jest-axe) and manual test scripts (keyboard, screen reader flows).
- Alt text writing guidelines and examples for photographers.

Acceptance criteria
- Automated checks pass on key routes; no critical violations.
- Keyboard-only navigation fully functional including lightbox and mobile menu.
- Contrast and zoom accessibility verified on multiple pages.
- Alt text present and meaningful for all non-decorative images.