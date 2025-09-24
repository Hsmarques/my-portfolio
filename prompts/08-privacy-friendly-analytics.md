# Prompt: Privacy-friendly analytics (cookieless, light, meaningful events)

Role: You are a web analytics engineer focused on privacy and product insights.

Context: The site avoids invasive tracking. We need lightweight, cookieless analytics that still inform content and UX decisions.

Objectives
- Integrate a privacy-first analytics tool (Plausible/Umami) with a clear event taxonomy for galleries, lightbox, blog, and contact.

Requirements
- Tooling
  - Self-hosted or hosted Plausible/Umami; no third-party cookies; DNT respected.
  - Optional server-side proxy for ad-block resilience without fingerprinting.
- Event taxonomy
  - Page views by route pattern.
  - `gallery_open`, `lightbox_open`, `lightbox_next`, `lightbox_prev`, `lightbox_zoom`, `share_click`, `buy_click`, `license_click`.
  - `blog_read` (scroll-depth 25/50/75/100), `subscribe_submit`, `contact_submit`.
- Implementation
  - Minimal payloads; no PII; consent banner only if required by jurisdiction.
  - Document how to add events and validate they fire correctly.
- Reporting
  - Dashboards for top galleries, time-to-first-interaction, lightbox engagement, and zero-result searches (if search exists later).

Deliverables
- Analytics integration code and environment configuration.
- Event helper with typed event names and safe payloads.
- Dashboards and saved reports with segments (mobile/desktop, referrers).
- QA checklist to verify events in dev and production.

Acceptance criteria
- No cookies set by analytics; total script < 5 KB gzipped where possible.
- Events reliably recorded with correct names and counts in dashboards.
- Documentation enables adding a new event in < 5 minutes.