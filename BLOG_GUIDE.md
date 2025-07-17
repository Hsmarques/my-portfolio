# How to Add a New Blog Post

This guide explains how to add new blog posts to your SolidJS Start website.

## Current Implementation

The blog system is currently implemented with hardcoded posts in the route files. This is a simple approach that works well for a personal blog with infrequent updates.

## Adding a New Blog Post

### Step 1: Add the Post Data

1. Open `src/routes/blog/[slug].tsx`
2. Find the `getBlogPost` function
3. Add a new entry to the `posts` object:

```typescript
const posts: Record<string, BlogPost> = {
  "welcome": {
    // ... existing welcome post
  },
  "your-new-post-slug": {
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
  }
};
```

### Step 2: Add to Blog Index

1. Open `src/routes/blog.tsx`
2. Find the `getBlogPosts` function
3. Add your new post to the array:

```typescript
const getBlogPosts = async (): Promise<BlogPost[]> => {
  return [
    {
      slug: "your-new-post-slug",
      title: "Your Post Title", 
      date: "2024-01-20",
      excerpt: "A brief description that appears on the blog index page"
    },
    {
      slug: "welcome",
      title: "Welcome to my blog!",
      date: "2024-01-15",
      excerpt: "This is my first blog post. Welcome to my corner of the internet where I share my thoughts on development, technology, and life."
    }
  ];
};
```

**Note:** Posts are displayed in the order they appear in the array, so put newer posts first.

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