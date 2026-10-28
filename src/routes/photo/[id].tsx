import {
  Show,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { A, useNavigate, useParams, useSearchParams } from "@solidjs/router";
import Footer from "~/components/Footer";
import PhotoImage from "~/components/PhotoImage";
import { PhotoSkeleton } from "~/components/Skeleton";
import { getSeriesBySlug, photoCaptionLine } from "~/lib/collections";
import { fetchCollections, fetchPhoto } from "~/lib/loadPhotos";

export default function SinglePhotoPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [photo] = createResource(
    () => params.id,
    async (id) => fetchPhoto(id),
  );

  // Series context for prev/next — collections payload only (ids), not the full photo list
  const seriesSlug = () => {
    const value = searchParams.series;
    return typeof value === "string" ? value : Array.isArray(value) ? value[0] : "";
  };

  const [seriesIds] = createResource(
    () => seriesSlug(),
    async (slug) => {
      if (!slug) return [] as string[];
      const collections = await fetchCollections();
      const series = getSeriesBySlug(collections, slug);
      return series?.photoIds ?? [];
    },
  );

  const indexInSeries = createMemo(() => {
    const list = seriesIds() ?? [];
    return list.findIndex((id) => id === params.id);
  });

  const prevId = createMemo(() => {
    const list = seriesIds() ?? [];
    const index = indexInSeries();
    if (index <= 0) return undefined;
    return list[index - 1];
  });

  const nextId = createMemo(() => {
    const list = seriesIds() ?? [];
    const index = indexInSeries();
    if (index < 0 || index >= list.length - 1) return undefined;
    return list[index + 1];
  });

  const hrefFor = (id: string) => {
    const slug = seriesSlug();
    const base = `/photo/${encodeURIComponent(id)}`;
    return slug ? `${base}?series=${encodeURIComponent(slug)}` : base;
  };

  const caption = createMemo(() => {
    const p = photo();
    return p ? photoCaptionLine(p) : undefined;
  });

  const [touchStartX, setTouchStartX] = createSignal<number | null>(null);

  const goPrev = () => {
    const target = prevId();
    if (target) navigate(hrefFor(target));
  };

  const goNext = () => {
    const target = nextId();
    if (target) navigate(hrefFor(target));
  };

  onMount(() => {
    if (typeof window === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });

  const onTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX();
    const end = e.changedTouches[0]?.clientX;
    setTouchStartX(null);
    if (start === null || end === undefined) return;
    const delta = end - start;
    if (Math.abs(delta) < 64) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  return (
    <div class="min-h-dvh flex flex-col bg-paper text-ink">
      <main
        id="main"
        class="flex-1"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Show when={!photo.loading} fallback={<PhotoSkeleton />}>
          <Show
            when={!photo.error && photo()}
            fallback={
              <div class="mx-auto max-w-xl px-4 pt-40 pb-24 text-center space-y-4">
                <p class="text-lg font-medium">
                  {photo.error ? "Photo could not be loaded" : "Photo not found"}
                </p>
                <p class="text-sm text-ink/60">
                  It may have been moved, or the link might be out of date.
                </p>
                <A
                  href="/"
                  class="inline-block text-sm font-medium underline-offset-4 hover:underline"
                >
                  Back to contents
                </A>
              </div>
            }
          >
            {(p) => (
              <div class="mx-auto max-w-5xl px-4 pt-28 md:pt-32 pb-16 select-none">
                <div class="flex items-center justify-between gap-4 mb-8 text-sm">
                  <Show
                    when={seriesSlug()}
                    fallback={
                      <A
                        href="/"
                        class="text-ink/50 hover:text-ink transition-colors duration-300 ease-photo"
                      >
                        Contents
                      </A>
                    }
                  >
                    <A
                      href={`/series/${seriesSlug()}`}
                      class="text-ink/50 hover:text-ink transition-colors duration-300 ease-photo"
                    >
                      Back to series
                    </A>
                  </Show>
                  <Show when={(seriesIds() ?? []).length > 0 && indexInSeries() >= 0}>
                    <p class="text-ink/40 tabular-nums">
                      {indexInSeries() + 1} / {(seriesIds() ?? []).length}
                    </p>
                  </Show>
                </div>

                <figure class="relative">
                  <PhotoImage
                    photo={p()}
                    src={p().srcFull || p().src}
                    class="block w-full h-auto max-h-[min(80dvh,900px)] object-contain mx-auto"
                    loading="eager"
                    sizes="(min-width: 1024px) 900px, 100vw"
                  />
                  <Show when={caption() || p().caption}>
                    <figcaption class="mt-4 text-sm text-ink/70 text-pretty">
                      <Show when={caption()}>
                        <span>{caption()}</span>
                      </Show>
                      <Show when={caption() && p().caption}>
                        <span aria-hidden="true"> · </span>
                      </Show>
                      <Show when={p().caption}>
                        <span>{p().caption}</span>
                      </Show>
                    </figcaption>
                  </Show>
                </figure>

                <Show
                  when={
                    p().exif &&
                    (p().exif?.camera ||
                      p().exif?.lens ||
                      p().exif?.aperture ||
                      p().exif?.shutter ||
                      p().exif?.iso)
                  }
                >
                  <dl class="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-ink/60">
                    <Show when={p().exif?.camera}>
                      <div>
                        <dt class="text-ink/40">Camera</dt>
                        <dd>{p().exif?.camera}</dd>
                      </div>
                    </Show>
                    <Show when={p().exif?.lens}>
                      <div>
                        <dt class="text-ink/40">Lens</dt>
                        <dd>{p().exif?.lens}</dd>
                      </div>
                    </Show>
                    <Show when={p().exif?.aperture}>
                      <div>
                        <dt class="text-ink/40">Aperture</dt>
                        <dd class="tabular-nums">{p().exif?.aperture}</dd>
                      </div>
                    </Show>
                    <Show when={p().exif?.shutter}>
                      <div>
                        <dt class="text-ink/40">Shutter</dt>
                        <dd class="tabular-nums">{p().exif?.shutter}</dd>
                      </div>
                    </Show>
                    <Show when={p().exif?.iso}>
                      <div>
                        <dt class="text-ink/40">ISO</dt>
                        <dd class="tabular-nums">{p().exif?.iso}</dd>
                      </div>
                    </Show>
                    <Show when={p().exif?.focalLengthMm}>
                      <div>
                        <dt class="text-ink/40">Focal length</dt>
                        <dd class="tabular-nums">{p().exif?.focalLengthMm}mm</dd>
                      </div>
                    </Show>
                  </dl>
                </Show>

                <div class="mt-10 flex items-center justify-between gap-4">
                  <Show
                    when={prevId()}
                    fallback={<span class="text-sm text-ink/25">Previous</span>}
                  >
                    {(prev) => (
                      <A
                        href={hrefFor(prev())}
                        class="text-sm font-medium text-ink/70 hover:text-ink transition-colors duration-300 ease-photo"
                        aria-label="Previous photograph"
                      >
                        Previous
                      </A>
                    )}
                  </Show>
                  <Show
                    when={nextId()}
                    fallback={<span class="text-sm text-ink/25">Next</span>}
                  >
                    {(next) => (
                      <A
                        href={hrefFor(next())}
                        class="text-sm font-medium text-ink/70 hover:text-ink transition-colors duration-300 ease-photo"
                        aria-label="Next photograph"
                      >
                        Next
                      </A>
                    )}
                  </Show>
                </div>
              </div>
            )}
          </Show>
        </Show>
      </main>
      <Footer />
    </div>
  );
}
