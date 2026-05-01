import {
  Show,
  For,
  createMemo,
  createResource,
} from "solid-js";
import { useParams } from "@solidjs/router";
import type { Photo } from "~/lib/photos";
import { fetchPhotos } from "~/lib/loadPhotos";

export default function SinglePhotoPage() {
  const params = useParams();
  const [remotePhotos] = createResource(fetchPhotos);
  const photos = createMemo(() => remotePhotos() ?? []);

  const photo = createMemo(() => photos().find((p: any) => p.id === params.id));

  // Get random related photos (excluding current photo)
  const relatedPhotos = createMemo(() => {
    const allPhotos = photos();
    const currentId = params.id;
    const filtered = allPhotos.filter((p: Photo) => p.id !== currentId);
    // Shuffle and take first 6
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  return (
    <main class="mx-auto max-w-7xl px-4 py-6">
      <Show
        when={remotePhotos.loading === false}
        fallback={<p class="text-bacalhau-300">Loading…</p>}
      >
        <Show
          when={photo()}
          fallback={
            <p class="text-bacalhau-300">
              {remotePhotos.error
                ? "Unable to load Cloudinary photos right now."
                : "Photo not found."}
            </p>
          }
        >
          {(p: any) => (
            <div class="space-y-6">
              <div class="w-full flex items-center justify-center relative">
                <img
                  src={(p() as any).srcFull || p().src}
                  alt={p().alt}
                  class="block w-full h-auto max-h-[calc(100dvh-200px)] object-contain rounded-lg"
                  width={p().width}
                  height={p().height}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>

              {/* Related Photos */}
              <Show when={relatedPhotos().length > 0}>
                <section class="mt-12">
                  <h2 class="text-xl text-bacalhau-200 mb-6">More photos</h2>
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <For each={relatedPhotos()}>
                      {(relatedPhoto: Photo) => (
                        <a
                          href={`/photo/${relatedPhoto.id}`}
                          class="group block overflow-hidden rounded-lg border border-vinho-700 hover:border-superbock transition-colors focus:outline-none focus:ring-2 focus:ring-superbock"
                        >
                          <img
                            src={relatedPhoto.src}
                            alt={relatedPhoto.alt}
                            loading="lazy"
                            class="w-full h-32 sm:h-40 object-cover"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          />
                        </a>
                      )}
                    </For>
                  </div>
                </section>
              </Show>
            </div>
          )}
        </Show>
      </Show>
    </main>
  );
}
