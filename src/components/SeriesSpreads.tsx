import { For, Match, Switch } from "solid-js";
import { A } from "@solidjs/router";
import PhotoImage from "~/components/PhotoImage";
import ScrollReveal from "~/components/ScrollReveal";
import { photoCaptionLine, resolveAlt } from "~/lib/collections";
import type { Photo } from "~/lib/photos";

type Spread =
  | { kind: "full"; photo: Photo }
  | { kind: "pair"; photos: [Photo, Photo] }
  | { kind: "margin"; photo: Photo; side: "left" | "right" };

function buildSpreads(photos: Photo[]): Spread[] {
  const spreads: Spread[] = [];
  let i = 0;
  let pattern = 0;

  while (i < photos.length) {
    const kind = (["full", "pair", "margin"] as const)[pattern % 3];
    pattern += 1;

    if (kind === "full") {
      spreads.push({ kind: "full", photo: photos[i] });
      i += 1;
      continue;
    }

    if (kind === "pair") {
      if (i + 1 < photos.length) {
        spreads.push({
          kind: "pair",
          photos: [photos[i], photos[i + 1]],
        });
        i += 2;
      } else {
        spreads.push({
          kind: "margin",
          photo: photos[i],
          side: pattern % 2 === 0 ? "left" : "right",
        });
        i += 1;
      }
      continue;
    }

    spreads.push({
      kind: "margin",
      photo: photos[i],
      side: pattern % 2 === 0 ? "left" : "right",
    });
    i += 1;
  }

  return spreads;
}

function Caption(props: { photo: Photo }) {
  const line = () => photoCaptionLine(props.photo);
  const hasCaption = () => Boolean(line() || props.photo.caption);

  if (!hasCaption()) return null;

  return (
    <figcaption class="mt-3 text-sm text-ink/70 text-pretty">
      {line() && <span>{line()}</span>}
      {line() && props.photo.caption && <span aria-hidden="true"> · </span>}
      {props.photo.caption && <span>{props.photo.caption}</span>}
    </figcaption>
  );
}

function LinkedFigure(props: {
  photo: Photo;
  class?: string;
  imgClass?: string;
  seriesSlug: string;
}) {
  return (
    <figure class={props.class}>
      <A
        href={`/photo/${encodeURIComponent(props.photo.id)}?series=${encodeURIComponent(props.seriesSlug)}`}
        class="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        aria-label={`Open ${resolveAlt(props.photo)}`}
      >
        <PhotoImage
          photo={props.photo}
          src={props.photo.srcFull || props.photo.src}
          class={props.imgClass || "w-full h-auto block"}
          sizes="(min-width: 1024px) 70vw, 100vw"
        />
      </A>
      <Caption photo={props.photo} />
    </figure>
  );
}

export default function SeriesSpreads(props: {
  photos: Photo[];
  seriesSlug: string;
}) {
  const spreads = () => buildSpreads(props.photos);

  return (
    <div
      class="space-y-24 md:space-y-32 pb-24 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <For each={spreads()}>
        {(spread) => (
          <Switch>
            <Match when={spread.kind === "full" && spread}>
              {(item) => {
                const full = item() as Extract<Spread, { kind: "full" }>;
                return (
                  <ScrollReveal as="section" class="w-full">
                    <LinkedFigure
                      photo={full.photo}
                      seriesSlug={props.seriesSlug}
                      class="w-full"
                      imgClass="w-full h-auto max-h-[90vh] object-cover object-center block"
                    />
                  </ScrollReveal>
                );
              }}
            </Match>
            <Match when={spread.kind === "pair" && spread}>
              {(item) => {
                const pair = item() as Extract<Spread, { kind: "pair" }>;
                return (
                  <ScrollReveal as="section" class="mx-auto max-w-6xl px-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                      <LinkedFigure
                        photo={pair.photos[0]}
                        seriesSlug={props.seriesSlug}
                      />
                      <LinkedFigure
                        photo={pair.photos[1]}
                        seriesSlug={props.seriesSlug}
                        class="md:mt-16"
                      />
                    </div>
                  </ScrollReveal>
                );
              }}
            </Match>
            <Match when={spread.kind === "margin" && spread}>
              {(item) => {
                const margin = item() as Extract<Spread, { kind: "margin" }>;
                return (
                  <ScrollReveal as="section" class="mx-auto max-w-6xl px-4">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                      <div
                        class={`md:col-span-5 ${
                          margin.side === "right"
                            ? "md:col-start-8"
                            : "md:col-start-1"
                        }`}
                      >
                        <LinkedFigure
                          photo={margin.photo}
                          seriesSlug={props.seriesSlug}
                          imgClass="w-full h-auto block"
                        />
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }}
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
}
