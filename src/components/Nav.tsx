import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-gray-400" : "border-transparent hover:border-gray-400";
  return (
    <nav class="bg-black/20 backdrop-blur sticky top-0 z-40">
      <ul class="container flex items-center justify-between p-3 text-gray-300">
        <li class="font-semibold tracking-wide"><a href="/">Hugo</a></li>
        <div class="flex items-center">
          <li class={`border-b-2 ${active("/photos")} mx-1.5 sm:mx-4`}>
            <a href="/photos">Photos</a>
          </li>
          <li class={`border-b-2 ${active("/blog")} mx-1.5 sm:mx-4`}>
            <a href="/blog">Blog</a>
          </li>
          <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-4`}>
            <a href="/about">About</a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
