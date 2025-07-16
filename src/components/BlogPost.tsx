import { Component } from "solid-js";
import { BlogPost as BlogPostType } from "~/data/blog-posts";

interface BlogPostProps {
  post: BlogPostType;
}

// Simple markdown renderer for basic formatting
function parseMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-300 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-200 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-100 mt-8 mb-6">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-200">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 border border-gray-700 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-gray-300 text-sm">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm">$1</code>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="text-gray-400 ml-4 mb-1">• $1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-400 ml-4 mb-1">$1</li>')
    // Paragraphs (preserve line breaks)
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.trim() && 
          !paragraph.includes('<h1') && 
          !paragraph.includes('<h2') && 
          !paragraph.includes('<h3') && 
          !paragraph.includes('<pre') && 
          !paragraph.includes('<li')) {
        return `<p class="text-gray-400 mb-4 leading-relaxed">${paragraph.trim()}</p>`;
      }
      return paragraph;
    })
    .join('\n');
}

const BlogPost: Component<BlogPostProps> = (props) => {
  const formattedDate = () => {
    return new Date(props.post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const htmlContent = () => parseMarkdown(props.post.content);

  return (
    <article class="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {props.post.title}
        </h1>
        
        {/* Meta information */}
        <div class="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
          <time dateTime={props.post.date}>
            {formattedDate()}
          </time>
          <span>•</span>
          <span>{props.post.readTime}</span>
        </div>

        {/* Tags */}
        <div class="flex flex-wrap gap-2 mb-6">
          {props.post.tags.map((tag) => (
            <span class="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700">
              {tag}
            </span>
          ))}
        </div>

        {/* Excerpt */}
        <div class="text-gray-300 text-lg italic border-l-4 border-gray-600 pl-4">
          {props.post.excerpt}
        </div>
      </header>

      {/* Content */}
      <div 
        class="prose prose-invert max-w-none"
        innerHTML={htmlContent()}
      />

      {/* Footer */}
      <footer class="mt-12 pt-6 border-t border-gray-700">
        <div class="text-center">
          <a 
            href="/blog" 
            class="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Back to Blog
          </a>
        </div>
      </footer>
    </article>
  );
};

export default BlogPost;