import { useParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import { getBlogPost } from "~/data/blog-posts";
import BlogPost from "~/components/BlogPost";

export default function BlogPostPage() {
  const params = useParams();
  
  const post = createMemo(() => {
    return getBlogPost(params.slug);
  });

  return (
    <div>
      {post() ? (
        <BlogPost post={post()!} />
      ) : (
        <main class="text-center mx-auto text-gray-400 p-8">
          <h1 class="text-4xl font-bold text-gray-300 mb-4">Post Not Found</h1>
          <p class="text-lg mb-6">
            Sorry, the blog post you're looking for doesn't exist.
          </p>
          <a 
            href="/blog" 
            class="inline-flex items-center text-gray-300 hover:text-gray-100 transition-colors font-medium"
          >
            ← Back to Blog
          </a>
        </main>
      )}
    </div>
  );
}