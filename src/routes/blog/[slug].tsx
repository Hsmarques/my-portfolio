import { useParams } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { getBlogPost, type BlogPost } from "~/lib/blogData";

// Simple markdown parser
function parseMarkdown(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('# ')) {
      result.push(`<h1>${line.slice(2)}</h1>`);
    } else if (line.startsWith('## ')) {
      result.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith('### ')) {
      result.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith('- ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      const listContent = line.slice(2);
      // Handle bold text in list items
      const formattedContent = listContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      result.push(`<li>${formattedContent}</li>`);
    } else if (line.startsWith('---')) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push('<hr>');
    } else if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(`<p><em>${line.slice(1, -1)}</em></p>`);
    } else if (line.trim() === '') {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      // Skip empty lines but don't add breaks
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      // Handle bold text and emojis in paragraphs
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      result.push(`<p>${formattedLine}</p>`);
    }
  }
  
  // Close any remaining list
  if (inList) {
    result.push('</ul>');
  }
  
  return result.join('');
}



export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = createAsync(() => getBlogPost(params.slug));

  return (
    <Show 
      when={post()} 
      fallback={
        <main class="max-w-4xl mx-auto px-4 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-100 mb-4">Post Not Found</h1>
            <p class="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <a 
              href="/blog" 
              class="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Back to Blog
            </a>
          </div>
        </main>
      }
    >
      {(currentPost) => (
        <article class="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <header class="mb-8 pb-8 border-b border-gray-700">
            <div class="mb-4">
              <a 
                href="/blog" 
                class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                ← Back to Blog
              </a>
            </div>
            <h1 class="text-4xl font-bold text-gray-100 mb-4">{currentPost.title}</h1>
            <time class="text-gray-500">
              {new Date(currentPost.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </header>

          {/* Content */}
          <div 
            class="prose prose-invert prose-gray max-w-none
              prose-headings:text-gray-100 
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
              prose-strong:text-gray-200
              prose-code:text-blue-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
              prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
              prose-blockquote:border-l-blue-400 prose-blockquote:text-gray-300
              prose-ul:text-gray-300 prose-ol:text-gray-300
              prose-li:text-gray-300
              prose-hr:border-gray-700"
            innerHTML={parseMarkdown(currentPost.content)}
          />
        </article>
      )}
    </Show>
  );
}