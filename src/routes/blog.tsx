import { For } from "solid-js";
import { A } from "@solidjs/router";
import { getAllBlogPosts } from "~/data/blog-posts";

export default function Blog() {
  const posts = getAllBlogPosts();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <main class="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-100 mb-4">Blog</h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Thoughts on web development, technology, and my journey as a developer in Portugal.
        </p>
      </header>

      {/* Blog posts list */}
      <div class="space-y-8">
        <For each={posts}>
          {(post) => (
            <article class="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
              {/* Post header */}
              <header class="mb-4">
                <h2 class="text-2xl font-bold text-gray-100 mb-2 hover:text-gray-300 transition-colors">
                  <A href={`/blog/${post.slug}`}>
                    {post.title}
                  </A>
                </h2>
                
                {/* Meta information */}
                <div class="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-3">
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Tags */}
                <div class="flex flex-wrap gap-2 mb-4">
                  <For each={post.tags}>
                    {(tag) => (
                      <span class="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">
                        {tag}
                      </span>
                    )}
                  </For>
                </div>
              </header>

              {/* Excerpt */}
              <p class="text-gray-400 leading-relaxed mb-4">
                {post.excerpt}
              </p>

              {/* Read more link */}
              <footer>
                <A 
                  href={`/blog/${post.slug}`}
                  class="inline-flex items-center text-gray-300 hover:text-gray-100 transition-colors font-medium"
                >
                  Read more →
                </A>
              </footer>
            </article>
          )}
        </For>
      </div>

      {/* Footer message */}
      <footer class="text-center mt-16 py-8 border-t border-gray-800">
        <p class="text-gray-400">
          More posts coming soon! Follow along as I share my thoughts on development and technology.
        </p>
      </footer>
    </main>
  );
}