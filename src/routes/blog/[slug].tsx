import { useParams } from "@solidjs/router";

import PageHeader from "~/components/PageHeader";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  
  // Static blog post for debugging
  const post = {
    slug: "welcome",
    title: "Welcome to my blog!",
    date: "2024-01-15",
    content: `
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
  };

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
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        result.push(`<p>${formattedLine}</p>`);
      }
    }
    
    if (inList) {
      result.push('</ul>');
    }
    
    return result.join('');
  }

  if (params.slug !== "welcome") {
    return (
      <main class="max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-8">
        <PageHeader
          title="Post Not Found"
          subtitle={<>The blog post you're looking for doesn't exist.</>}
        />
        <div class="text-center">
          <a 
            href="/blog" 
            class="inline-block bg-accent-600 hover:bg-accent-500 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Back to Blog
          </a>
        </div>
      </main>
    );
  }

  return (
    <article class="max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-8">
      <header class="mb-8 pb-8 border-b border-gray-700">
        <div class="mb-6 text-center">
          <a 
            href="/blog" 
            class="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
          >
            ← Back to Blog
          </a>
        </div>
        <PageHeader
          title={post.title}
          subtitle={
            <>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </>
          }
          class="mb-0"
        />
      </header>

      {/* Content */}
      <div 
        class="prose prose-invert prose-gray max-w-none
          prose-headings:text-gray-100 
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-accent-400 prose-a:no-underline hover:prose-a:text-accent-300
          prose-strong:text-gray-200
          prose-code:text-accent-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
          prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
          prose-blockquote:border-l-accent-400 prose-blockquote:text-gray-300
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-li:text-gray-300
          prose-hr:border-gray-700"
        innerHTML={parseMarkdown(post.content)}
      />
    </article>
  );
}