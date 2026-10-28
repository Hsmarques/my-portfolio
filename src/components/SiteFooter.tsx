export default function SiteFooter() {
  return (
    <footer class="w-full px-4 py-8 text-sm text-[#9B9B9B]">
      <div class="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>Hugo Marques</p>
        <div class="flex flex-wrap gap-4">
          <a
            href="/about"
            class="hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            About
          </a>
          {/* TODO(Hugo): replace with real contact email */}
          <a
            href="mailto:TODO@example.com"
            class="hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            Contact (TODO)
          </a>
          {/* TODO(Hugo): replace with real Instagram URL */}
          <a
            href="https://instagram.com/TODO"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            Instagram (TODO)
          </a>
          <a
            href="https://www.buymeacoffee.com/hugosmarques"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            Buy me a coffee
          </a>
        </div>
      </div>
    </footer>
  );
}
