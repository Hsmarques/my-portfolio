export default function Footer() {
  return (
    <footer class="border-t border-[#181818]/10 px-6 py-12 text-[#181818]">
      <div class="mx-auto flex max-w-5xl flex-col gap-4 text-xs md:flex-row md:items-start md:justify-between">
        <div class="space-y-2">
          <p class="font-medium text-sm">Hugo Marques</p>
          <p>
            {/* TODO(Hugo): replace with real contact email */}
            <a
              href="mailto:hello@example.com"
              class="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
            >
              hello@example.com
            </a>
            <span class="ml-2 text-[#181818]/50">(TODO: contact)</span>
          </p>
          <p>
            {/* TODO(Hugo): replace with real Instagram handle */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
            >
              Instagram
            </a>
            <span class="ml-2 text-[#181818]/50">(TODO: handle)</span>
          </p>
        </div>
        <div class="space-y-2 md:text-right">
          <a
            href="https://www.buymeacoffee.com/hugosmarques"
            target="_blank"
            rel="noopener noreferrer"
            class="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
          >
            Buy me a coffee
          </a>
          <p class="text-[#181818]/50">Photographs of quiet places.</p>
        </div>
      </div>
    </footer>
  );
}
