# Prompt: Trust and conversion (About, social proof, pricing, contact)

Role: You are a product designer-engineer focused on credibility and frictionless contact.

Context: Visitors should quickly trust the photographer, understand offerings, and know how to get in touch or purchase.

Objectives
- Create trust-building surfaces (About page, client logos/publications, awards/exhibitions).
- Publish transparent pricing (services and prints) and streamline contacting/scheduling.

Requirements
- About
  - Short, authentic bio with portrait, location, and specialties.
  - Selected clients/publications grid; awards/exhibitions list.
- Pricing
  - Services packages with clear deliverables and price ranges; link to detailed terms.
  - Prints page with sizes, paper types, editions (if any), and pricing; FAQs.
- Contact
  - Simple contact form (name, email, message), optional budget and service type.
  - Scheduling integration (Cal.com/Calendly) or ICS download fallback.
  - Spam protection (honeypot + rate limiting); success/failure states; clear response time expectations.
- Legal/trust
  - Licensing explainer (editorial vs commercial), privacy policy, terms of service.

Deliverables
- `/about`, `/pricing` (or `/prints`), `/contact` routes and components.
- Form handling (serverless or backend), validation, and notifications.
- Logo grid component fed by data file; awards/exhibitions schema.
- Documentation for updating pricing and client lists.

Acceptance criteria
- Contact form is accessible, validates inline, and sends submissions reliably.
- Scheduling link works across devices; no tracking blockers required.
- Pricing pages are scannable, mobile-friendly, and updatable from a single data source.
- Trust elements (logos, awards) are optimized, responsive, and labeled for screen readers.