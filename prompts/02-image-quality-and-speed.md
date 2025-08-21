# Prompt: Image quality and speed (responsive, AVIF/WebP, LQIP/BlurHash)

Role: You are a performance-focused imaging engineer.

Context: Personal photography site with many large images; speed and visual fidelity matter equally. The site will also include a blog.

Objectives
- Implement a modern image pipeline that outputs responsive sources (sizes/srcset), AVIF/WebP + JPEG fallbacks, DPR variants, and art-directed crops.
- Add lightweight placeholders (LQIP and/or BlurHash) and prioritize the LCP asset.
- Ensure color management (convert to sRGB, embed profile) and strip heavy EXIF by default while surfacing key fields in UI.

Requirements
- Responsive delivery
  - Generate multiple widths per image (e.g., 320–2560 px) and DPR 1x/2x.
  - Provide `<picture>` with `type=image/avif`, `type=image/webp`, and fallback JPEG/PNG.
  - Provide `sizes` based on layout breakpoint rules and component container width.
- Placeholders and priority
  - Generate LQIP (~10–20px blur) and/or BlurHash tokens; show placeholder until decode complete.
  - Preload the LCP image and critical CSS; ensure no CLS.
- Color and metadata
  - Convert to sRGB and embed profile for consistent rendering.
  - Strip heavy EXIF from delivery by default; make key EXIF available via JSON for UI display when requested.
- Pipeline options (choose one)
  - External CDN (Cloudinary/Imgix/ImageKit). Include mapping from source path to transformed URLs.
  - Local pipeline using `sharp` during build or on-demand functions, with caching.
- Developer ergonomics
  - Simple helper/component API to request images by logical id/slug and desired layout (fill, fixed, responsive) and crop focal point.
  - Document how to add new images, regenerate outputs, and purge caches.

Deliverables
- CLI or build step to generate assets and metadata manifest (widths, heights, mime types, placeholder data, focal points).
- Reusable `<Image>` helper or component with ergonomic props.
- Configuration for AVIF/WebP quality settings (target excellent visual quality with small size).
- Documentation with examples in homepage grid, gallery, lightbox, and blog.

Acceptance criteria
- LCP image decodes quickly; LCP <= 1.8s (mid-tier mobile) on a typical gallery page.
- Correct `srcset/sizes` usage verified by Lighthouse and WebPageTest; no upscaling or blurry renders.
- Placeholders render promptly and transition without layout shift or jank.
- Total transferred size for a gallery page reduced by >= 40% compared to baseline JPEGs.
- Color matches exported sRGB images across modern browsers.

Notes
- Keep runtime JS minimal; do not add heavy client libraries.
- Include a script to audit existing images for missing alt text and large dimensions.