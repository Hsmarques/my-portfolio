import { For } from "solid-js";
import { createAsync } from "@solidjs/router";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

// In a real app, this would fetch from a CMS or markdown files
const getBlogPosts = async (): Promise<BlogPost[]> => {
  return [
    {
      slug: "welcome",
      title: "Welcome to my blog!",
      date: "2024-01-15",
      excerpt: "This is my first blog post. Welcome to my corner of the internet where I share my thoughts on development, technology, and life."
    }
  ];
};

export default function Blog() {
  const posts = createAsync(() => getBlogPosts());

  return (
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-100 mb-4">Blog</h1>
        <p class="text-gray-400 text-lg">Thoughts, stories, and ideas</p>
      </div>
      
      <div class="space-y-8">
        <For each={posts()}>
          {(post) => (
            <article class="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h2 class="text-xl font-semibold text-gray-100 hover:text-blue-400 transition-colors">
                  <a href={`/blog/${post.slug}`} class="block">
                    {post.title}
                  </a>
                </h2>
                <time class="text-sm text-gray-500 mt-1 sm:mt-0">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <p class="text-gray-400 leading-relaxed">{post.excerpt}</p>
              <a 
                href={`/blog/${post.slug}`}
                class="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Read more →
              </a>
            </article>
          )}
        </For>
      </div>
    </main>
  );
}