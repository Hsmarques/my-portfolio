import { Show, createMemo, createResource } from "solid-js";
import { A, useParams } from "@solidjs/router";
import DarkroomChrome from "~/components/DarkroomChrome";
import ProtectedImage from "~/components/ProtectedImage";
import PhotoSkeleton from "~/components/PhotoSkeleton";
import SiteFooter from "~/components/SiteFooter";
import { fetchPhotoById, friendlyErrorMessage } from "~/lib/loadPhotos";

export default function SinglePhotoPage() {
  const params = useParams();
  const [photo] = createResource(
    () => params.id,
    (id) => fetchPhotoById(id),
  );

  const captionLine = createMemo(() => {
    const p = photo();
    if (!p) return "";
    return [p.place, p.year].filter(Boolean).join(", ");
  });

  const exifLine = createMemo(() => {
    const exif = photo()?.exif;
    if (!exif) return "";
    const parts = [
      exif.camera,
      exif.lens,
      exif.focalLengthMm ? `${exif.focalLengthMm}mm` : undefined,
      exif.aperture,
      exif.shutter,
      exif.iso ? `ISO ${exif.iso}` : undefined,
    ].filter(Boolean);
    return parts.join(" · ");
  });

  return (
    <main
      class="bg-[#181818] text-white min-h-[100dvh] pt-16 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <DarkroomChrome />

      <Show
        when={!photo.loading}
        fallback={
          <div class="px-4 md:px-6 flex items-center justify-center min-h-[70dvh]">
            <PhotoSkeleton class="h-[60dvh] w-full max-w-5xl" />
          </div>
        }
      >
        <Show
          when={!photo.error && photo()}
          fallback={
            <div class="px-6 py-24 text-center space-y-4">
              <p class="text-sm text-[#9B9B9B]">
                {photo.error
                  ? friendlyErrorMessage(photo.error)
                  : "Photo not found."}
              </p>
              <A href="/photos" class="text-sm text-white hover:opacity-70">
                Back to index
              </A>
            </div>
          }
        >
          {(p) => (
            <div class="px-4 md:px-6 pb-10">
              <div class="mx-auto flex min-h-[70dvh] max-w-6xl items-center justify-center">
                <ProtectedImage
                  src={p().srcFull || p().src}
                  alt={p().alt}
                  width={p().width}
                  height={p().height}
                  class="max-h-[78dvh] w-auto max-w-full object-contain"
                  loading="eager"
                />
              </div>

              <div class="mx-auto mt-6 max-w-6xl space-y-2">
                <Show when={captionLine() || p().caption}>
                  <p class="text-sm text-[#9B9B9B] text-wrap-pretty">
                    {captionLine()}
                    <Show when={p().caption}>
                      <span>
                        {captionLine() ? " — " : ""}
                        {p().caption}
                      </span>
                    </Show>
                  </p>
                </Show>
                <Show when={exifLine()}>
                  <p class="font-mono text-sm text-[#9B9B9B]">{exifLine()}</p>
                </Show>
                <Show when={p().seriesSlug}>
                  <A
                    href={`/series/${p().seriesSlug}`}
                    class="inline-block text-sm text-white hover:opacity-70 transition-opacity duration-300 ease-darkroom"
                  >
                    View series
                  </A>
                </Show>
              </div>
            </div>
          )}
        </Show>
      </Show>

      <SiteFooter />
    </main>
  );
}
