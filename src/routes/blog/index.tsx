import { For } from "solid-js";

export default function Blog() {
  // Static blog posts for debugging
  const posts = [
    {
      slug: "welcome",
      title: "Welcome to my blog!",
      date: "2024-01-15",
      excerpt: "Behind-the-shot notes, processing, and the code powering this site."
    }
  ];

  return (
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-100 mb-4">Blog</h1>
        <p class="text-gray-400 text-lg">
          Photography field notes, editing workflows, and occasional deep dives into the
          code that runs this site.
        </p>
      </div>
      
      <div class="space-y-8">
        <For each={posts}>
          {(post) => (
            <article class="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h2 class="text-xl font-semibold text-gray-100 hover:text-accent-400 transition-colors">
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
                class="inline-block mt-4 text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
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