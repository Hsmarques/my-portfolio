import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname 
      ? "border-purple-400 text-white" 
      : "border-transparent text-gray-400 hover:border-gray-400 hover:text-gray-200";
  
  return (
    <nav class="bg-black/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div class="container mx-auto px-4">
        <ul class="flex items-center h-16 text-sm md:text-base">
          <li class="mr-auto">
            <a href="/" class="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Hugo.dev
            </a>
          </li>
          <li class={`border-b-2 ${active("/")} mx-2 md:mx-4 transition-all duration-200`}>
            <a href="/" class="inline-block py-5 px-1">Home</a>
          </li>
          <li class={`border-b-2 ${active("/projects")} mx-2 md:mx-4 transition-all duration-200`}>
            <a href="/projects" class="inline-block py-5 px-1">Projects</a>
          </li>
          <li class={`border-b-2 ${active("/photography")} mx-2 md:mx-4 transition-all duration-200`}>
            <a href="/photography" class="inline-block py-5 px-1">Photography</a>
          </li>
          <li class={`border-b-2 ${active("/blog")} mx-2 md:mx-4 transition-all duration-200`}>
            <a href="/blog" class="inline-block py-5 px-1">Blog</a>
          </li>
          <li class={`border-b-2 ${active("/about")} mx-2 md:mx-4 transition-all duration-200`}>
            <a href="/about" class="inline-block py-5 px-1">About</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
