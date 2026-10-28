import { A, useParams } from "@solidjs/router";
import { Show, createMemo, createResource } from "solid-js";

import PhotoSkeleton from "~/components/PhotoSkeleton";
import PhotoStage from "~/components/PhotoStage";
import { fetchPhoto } from "~/lib/loadPhotos";

export default function SinglePhotoPage() {
  const params = useParams();
  const id = () => decodeURIComponent(params.id || "");
  const [photo] = createResource(id, (value) => {
    if (!value) return Promise.reject(new Error("That photograph could not be found."));
    return fetchPhoto(value);
  });

  const seriesLink = createMemo(() => {
    const current = photo();
    const slug = current?.seriesSlugs?.[0];
    return slug ? `/series/${slug}` : "/photos";
  });

  return (
    <main class="min-h-dvh bg-[#F7F6F2] pb-24 pt-28 text-[#181818]">
      <div class="mx-auto mb-8 flex max-w-5xl items-center justify-between px-6 text-sm">
        <A
          href={seriesLink()}
          class="text-[#181818]/70 underline-offset-4 hover:text-[#181818] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
        >
          Back
        </A>
      </div>

      <Show
        when={!photo.loading}
        fallback={
          <div class="flex justify-center px-6">
            <PhotoSkeleton class="h-[65vh] w-full max-w-3xl" />
          </div>
        }
      >
        <Show
          when={!photo.error && photo()}
          fallback={
            <p class="px-6 text-center text-sm text-[#181818]/70">
              That photograph could not be found.
            </p>
          }
        >
          {(current) => (
            <div class="px-6">
              <PhotoStage photo={current()} />
              <Show
                when={
                  current().exif &&
                  Object.values(current().exif || {}).some(Boolean)
                }
              >
                <dl class="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-2 text-xs text-[#181818]/60 sm:grid-cols-3">
                  <Show when={current().exif?.camera}>
                    <div>
                      <dt class="sr-only">Camera</dt>
                      <dd>{current().exif?.camera}</dd>
                    </div>
                  </Show>
                  <Show when={current().exif?.lens}>
                    <div>
                      <dt class="sr-only">Lens</dt>
                      <dd>{current().exif?.lens}</dd>
                    </div>
                  </Show>
                  <Show when={current().exif?.focalLengthMm}>
                    <div>
                      <dt class="sr-only">Focal length</dt>
                      <dd>{current().exif?.focalLengthMm}mm</dd>
                    </div>
                  </Show>
                  <Show when={current().exif?.aperture}>
                    <div>
                      <dt class="sr-only">Aperture</dt>
                      <dd>{current().exif?.aperture}</dd>
                    </div>
                  </Show>
                  <Show when={current().exif?.shutter}>
                    <div>
                      <dt class="sr-only">Shutter</dt>
                      <dd>{current().exif?.shutter}</dd>
                    </div>
                  </Show>
                  <Show when={current().exif?.iso}>
                    <div>
                      <dt class="sr-only">ISO</dt>
                      <dd>ISO {current().exif?.iso}</dd>
                    </div>
                  </Show>
                </dl>
              </Show>
            </div>
          )}
        </Show>
      </Show>
    </main>
  );
}
