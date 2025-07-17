# How to Add a New Blog Post

This guide explains how to add new blog posts to your SolidJS Start website.

## Current Implementation

The blog system is currently implemented with hardcoded posts in a shared data file (`src/lib/blogData.ts`). This is a simple approach that works well for a personal blog with infrequent updates.

## Adding a New Blog Post

### Step 1: Add the Post Data

1. Open `src/lib/blogData.ts`
2. Find the `blogPosts` array
3. Add a new blog post object to the array:

```typescript
export const blogPosts: BlogPost[] = [
  {
    slug: "your-new-post-slug",
    title: "Your Post Title",
    date: "2024-01-20", // Use YYYY-MM-DD format
    excerpt: "A brief description that appears on the blog index page",
    content: `
# Your Post Title

Your post content goes here...

## Supported Markdown

- **Bold text** using **text**
- *Italic text* using *text*
- Headings using # ## ###
- Lists using - 
- Horizontal rules using ---

You can use emojis and any text formatting you need.
    `
  },
  {
    slug: "welcome",
    title: "Welcome to my blog!",
    date: "2024-01-15",
    excerpt: "This is my first blog post. Welcome to my corner of the internet where I share my thoughts on development, technology, and life.",
    content: `...` // existing content
  }
];
```

**Note:** Posts are automatically sorted by date (newest first), so you can add new posts anywhere in the array.

That's it! No need to update multiple files - both the blog index and individual post pages will automatically pick up the new post.

## Markdown Support

The blog system includes a simple markdown parser that supports:

- **Headings**: `# H1`, `## H2`, `### H3`
- **Bold text**: `**bold text**`
- **Italic text**: `*italic text*`
- **Lists**: Lines starting with `- `
- **Horizontal rules**: `---`
- **Paragraphs**: Regular text automatically becomes paragraphs

## Best Practices

1. **Slug naming**: Use lowercase, hyphen-separated URLs (e.g., "my-awesome-post")
2. **Date format**: Always use YYYY-MM-DD format for consistency
3. **Excerpts**: Keep them concise but descriptive (2-3 sentences max)
4. **Content**: Write in markdown format with proper headings for better readability

## Future Improvements

For a more scalable solution, consider:

1. **Markdown files**: Store posts as `.md` files and parse them at build time
2. **CMS integration**: Use a headless CMS like Strapi, Sanity, or Contentful
3. **Database**: Store posts in a database for dynamic management
4. **Admin interface**: Build a simple admin panel for managing posts

## File Structure

```
src/
  lib/
    blogData.ts       # Shared blog data and functions
  routes/
    blog.tsx          # Blog index page (lists all posts)
    blog/
      [slug].tsx      # Individual blog post page
  components/
    Nav.tsx           # Navigation (includes blog link)
```

## Styling

The blog uses Tailwind CSS with the Typography plugin for content styling. The design follows the dark theme of the rest of the site with:

- Dark background (`bg-gray-900/50`)
- Light text (`text-gray-100`, `text-gray-300`)
- Blue accent color for links (`text-blue-400`)
- Consistent spacing and typography

That's it! Your new blog post should now be accessible at `/blog/your-new-post-slug`.