import { For } from "solid-js";

import PageHeader from "~/components/PageHeader";

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
    <main class="max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-20">
      <PageHeader
        title="Blog"
        subtitle={
          <>
            Photography field notes, editing workflows, and occasional deep dives
            into the code that runs this site.
          </>
        }
      />
      
      <div class="space-y-8">
        <For each={posts}>
          {(post) => (
            <article class="bg-cream/55 rounded-lg p-6 border border-port/12 hover:border-port/25 transition-colors backdrop-blur-sm shadow-sm shadow-port/5">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h2 class="text-xl font-semibold text-port hover:text-accent-500 transition-colors">
                  <a href={`/blog/${post.slug}`} class="block">
                    {post.title}
                  </a>
                </h2>
                <time class="text-sm text-port/50 mt-1 sm:mt-0">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <p class="text-port/70 leading-relaxed">{post.excerpt}</p>
              <a 
                href={`/blog/${post.slug}`}
                class="inline-block mt-4 text-accent-500 hover:text-accent-400 text-sm font-medium transition-colors"
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