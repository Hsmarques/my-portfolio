import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-gray-400" : "border-transparent hover:border-gray-400";
  return (
    <nav class="bg-black/10">
      <ul class="container flex items-center p-3 text-gray-400">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
        <li class={`border-b-2 ${active("/blog")} mx-1.5 sm:mx-6`}>
          <a href="/blog">Blog</a>
        </li>
      </ul>
    </nav>
  );
}
