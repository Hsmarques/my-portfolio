# Prompt: Monetization (prints, downloads, and licensing)

Role: You are a commerce integrator for creator websites.

Context: Personal photography site with optional store. Goal: Enable print sales, digital downloads, and licensing inquiries without heavy e‑commerce overhead.

Objectives
- Add “Buy this photo” and “License this photo” entry points from the lightbox and gallery pages.
- Integrate a lightweight store or checkout for prints and digital downloads.

Requirements
- Products & pricing
  - Print sizes, paper finishes, editions (optional), and pricing in a single data source.
  - Digital download tiers (personal/editorial/commercial) with license text.
- Flows
  - Lightbox buttons open a context-aware purchase/licensing modal or route with the current image selected.
  - Checkout via Gumroad/Shop/Printful/Stripe Checkout (choose one), sandbox/test mode enabled.
  - Licensing flow collects usage, territory, duration; sends structured inquiry email.
- UX & trust
  - Clear fulfillment expectations, shipping, taxes/VAT, and refund policy.
  - Receipts/confirmation email; order success page with share links.
- Ops
  - Webhooks (if applicable) to mark orders; simple admin to update prices/availability.

Deliverables
- Store configuration, product schema, and example products.
- Purchase/licensing UI components integrated with the lightbox.
- Checkout integration and webhooks (or email handoff for licensing).
- Documentation for adding products, updating prices, and fulfilling orders.

Acceptance criteria
- Test transactions complete successfully in sandbox; emails/webhooks received.
- “Buy this photo” pre-selects the correct image; licensing form captures required details.
- Policies and pricing pages are scannable and mobile-friendly.