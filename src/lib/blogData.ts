export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "welcome",
    title: "Welcome to my blog!",
    date: "2024-01-15",
    excerpt: "This is my first blog post. Welcome to my corner of the internet where I share my thoughts on development, technology, and life.",
    content: `
# Welcome to my blog!

Hello there! 👋

I'm excited to finally launch my blog. This is a space where I'll be sharing my thoughts, experiences, and learnings as a developer from Portugal.

## What you can expect

Here's what I plan to write about:

- **Development insights**: Tips, tricks, and lessons learned from my coding journey
- **Technology trends**: My take on new frameworks, tools, and industry developments  
- **Project showcases**: Deep dives into interesting projects I'm working on
- **Career growth**: Reflections on professional development and the tech industry
- **Random thoughts**: Sometimes just musings about life, creativity, and problem-solving

## A bit about me

I'm a developer passionate about creating meaningful digital experiences. I love working with modern web technologies, exploring new frameworks, and solving complex problems. When I'm not coding, you might find me exploring Portugal's beautiful landscapes or learning something new.

## Let's connect

This blog is just one way I share my journey. Feel free to reach out if you want to discuss anything I've written about, or if you just want to say hi!

Thanks for stopping by, and I hope you find something useful or interesting in my posts.

Happy coding! 🚀

---

*This is my first blog post, so please bear with me as I find my voice and rhythm. I'm always open to feedback and suggestions!*
    `
  }
];

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  // Sort posts by date (newest first)
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  return blogPosts.find(post => post.slug === slug) || null;
};