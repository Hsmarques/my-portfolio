export default function Footer() {
  return (
    <footer class="border-t border-ink/10 mt-auto">
      <div class="mx-auto max-w-6xl px-4 py-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between text-sm text-ink/70">
        <div class="space-y-2">
          <p class="text-ink font-medium">Hugo Marques</p>
          <p class="max-w-sm text-pretty">
            Coast and street photographs from the UK and Portugal.
          </p>
        </div>
        <div class="space-y-2">
          <p>
            {/* TODO(Hugo): replace with real contact email */}
            <span class="text-ink/40">TODO</span>{" "}
            <a
              href="mailto:hello@example.com"
              class="underline-offset-4 hover:underline hover:text-ink transition-colors duration-300 ease-photo"
            >
              hello@example.com
            </a>
          </p>
          <p>
            {/* TODO(Hugo): replace with real Instagram handle */}
            <span class="text-ink/40">TODO</span>{" "}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline-offset-4 hover:underline hover:text-ink transition-colors duration-300 ease-photo"
            >
              Instagram
            </a>
          </p>
          <p>
            <a
              href="https://www.buymeacoffee.com/hugosmarques"
              target="_blank"
              rel="noopener noreferrer"
              class="underline-offset-4 hover:underline hover:text-ink transition-colors duration-300 ease-photo"
            >
              Buy me a coffee
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
