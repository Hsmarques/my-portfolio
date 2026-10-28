import { A, useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();

  const linkClass = (path: string) => {
    const active =
      path === "/"
        ? location.pathname === "/"
        : location.pathname === path || location.pathname.startsWith(`${path}/`);
    return active
      ? "text-[#181818] font-medium"
      : "text-[#181818]/70 hover:text-[#181818] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
  };

  return (
    <nav class="fixed top-0 inset-x-0 z-40 bg-[#F7F6F2]/95">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <A
          href="/"
          class="text-sm font-medium text-[#181818] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
        >
          Hugo Marques
        </A>
        <ul class="flex items-center gap-6 text-sm">
          <li>
            <A
              href="/photos"
              class={`${linkClass("/photos")} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]`}
            >
              Index
            </A>
          </li>
          <li>
            <A
              href="/about"
              class={`${linkClass("/about")} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]`}
            >
              About
            </A>
          </li>
        </ul>
      </div>
    </nav>
  );
}
