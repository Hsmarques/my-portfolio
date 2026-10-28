import { Show, createMemo, createResource } from "solid-js";
import DarkroomChrome from "~/components/DarkroomChrome";
import FeaturedHero from "~/components/FeaturedHero";
import SiteFooter from "~/components/SiteFooter";
import PhotoSkeleton from "~/components/PhotoSkeleton";
import {
  fetchPhotosPayload,
  friendlyErrorMessage,
} from "~/lib/loadPhotos";

export default function Home() {
  const [payload] = createResource(fetchPhotosPayload);

  const featured = createMemo(() => {
    const data = payload();
    if (!data) return [];
    const byId = new Map(data.photos.map((p) => [p.id, p]));
    const fromIds = data.featuredIds
      .map((id) => byId.get(id))
      .filter(Boolean);
    if (fromIds.length > 0) return fromIds as typeof data.photos;
    return data.photos.slice(0, 5);
  });

  return (
    <main class="bg-black text-white min-h-[100dvh]">
      <DarkroomChrome />
      <Show
        when={!payload.loading}
        fallback={
          <div class="min-h-[100dvh] w-full flex items-center justify-center px-6 bg-black">
            <PhotoSkeleton class="h-[70dvh] w-full max-w-5xl" />
          </div>
        }
      >
        <Show
          when={!payload.error && featured().length > 0}
          fallback={
            <div class="min-h-[100dvh] w-full flex items-center justify-center px-6 text-center bg-black">
              <p class="text-sm text-[#9B9B9B] max-w-md text-wrap-pretty">
                {friendlyErrorMessage(payload.error)}
              </p>
            </div>
          }
        >
          <FeaturedHero photos={featured()} />
          <div class="bg-[#181818]">
            <SiteFooter />
          </div>
        </Show>
      </Show>
    </main>
  );
}
