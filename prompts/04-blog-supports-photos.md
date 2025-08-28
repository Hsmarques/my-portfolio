# Prompt: Blog that supports the photos (MDX, photo essays, rich media)

Role: You are a content platform engineer with strong UX writing instincts.

Context: The blog complements the photography—photo essays, behind-the-scenes notes, gear/setup breakdowns, travel stories.

Objectives
- Implement a photo-first MDX blog with rich components for visual storytelling.
- Optimize reading comfort and add distribution essentials (RSS, social cards, related posts, email subscribe).

Requirements
- Authoring and content model
  - MDX posts with frontmatter: title, slug, date, summary, cover image, tags, readingTime, images[].
  - Content components: BeforeAfterSlider, ImageGrid/Masonry, CaptionedImage, PullQuote, Callout, Timeline, VideoEmbed, Footnote.
- Reading experience
  - Comfortable measure (70–80ch), generous line-height/spacing, large and legible typography.
  - Captions styled to assist the story; optional EXIF snippet per image.
  - Related posts section based on tags or manual curation.
- Distribution
  - RSS/Atom feed with full content and images.
  - Open Graph/Twitter cards with large image, author/site metadata, and canonical URLs.
  - Email subscribe block that can be embedded mid-article and at the end.
- Performance & SEO
  - Defer non-critical scripts; ensure images use the shared image pipeline.
  - Structured data for `BlogPosting`, including `image` array, author, datePublished.

Deliverables
- MDX runtime/configuration, content components, templates for index and article pages.
- RSS feed generation, OG image template (static or dynamic), related posts algorithm.
- Example posts (3+) showcasing each rich component.
- Documentation for authors: how to write, embed components, and add images.

Acceptance criteria
- Posts render with crisp images, no layout shift, and pass accessibility checks.
- Feeds validate and include correct image enclosures.
- Social shares display rich cards with the intended cover image and title.
- Related posts populate with sensible results or manual overrides.