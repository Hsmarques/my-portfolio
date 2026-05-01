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
    <main class="max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-8">
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
            <article class="bg-vinho/30 rounded-lg p-6 border border-superbock/15 hover:border-superbock/30 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h2 class="text-xl font-semibold text-bacalhau hover:text-superbock transition-colors">
                  <a href={`/blog/${post.slug}`} class="block">
                    {post.title}
                  </a>
                </h2>
                <time class="text-sm text-vinho-300 mt-1 sm:mt-0">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <p class="text-bacalhau-300 leading-relaxed">{post.excerpt}</p>
              <a 
                href={`/blog/${post.slug}`}
                class="inline-block mt-4 text-superbock hover:text-superbock-300 text-sm font-medium transition-colors"
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