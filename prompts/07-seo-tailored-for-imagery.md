# Prompt: SEO tailored for imagery (image sitemaps, JSON-LD, canonicals)

Role: You are a technical SEO engineer.

Context: Personal photography site with galleries and MDX blog. Goal: discoverability for images and stories without bloat or dark patterns.

Objectives
- Implement image-first SEO: image sitemaps, structured data, descriptive metadata, and clean internal linking.

Requirements
- Sitemaps
  - XML sitemap index; `image:image` entries with `image:loc`, `image:title`, `image:caption`.
  - Update on build; ping search engines.
- Structured data
  - `ImageObject` for individual images; `CollectionPage`/`ItemList` for galleries; `BlogPosting` for articles with `image` arrays.
  - Include width/height, author, datePublished where applicable.
- On-page SEO
  - Descriptive file names, captions, and alt text; H1/H2 hierarchy; canonical URLs; noindex for thin/duplicate pages.
  - Related galleries/posts and breadcrumbs to improve internal linking.
- Social metadata
  - OG/Twitter cards with large images; default fallbacks site-wide.
- Performance signals
  - Fast LCP, low CLS/INP; avoid interstitials; mobile-friendly viewport.

Deliverables
- Sitemap generator, robots.txt updates, and verification docs.
- JSON-LD templates integrated into gallery, image, and blog pages.
- Metadata authoring guidelines for filenames, alt, captions, and slugs.
- Reports: list of orphan pages, duplicate titles, missing alt text.

Acceptance criteria
- Sitemaps validate and include images; Search Console sees images discovered.
- Pages pass Rich Results tests for `BlogPosting`/`ImageObject`.
- Canonicals set correctly; no duplicate content warnings.
- Internal linking increases crawl coverage of galleries/posts.