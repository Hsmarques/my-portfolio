import type { JSX } from "solid-js";
import { resolveAlt } from "~/lib/collections";
import type { Photo } from "~/lib/photos";

type PhotoImageProps = {
  photo: Photo;
  src?: string;
  class?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  onLoad?: JSX.EventHandlerUnion<HTMLImageElement, Event>;
};

export default function PhotoImage(props: PhotoImageProps) {
  return (
    <img
      src={props.src || props.photo.src}
      alt={resolveAlt(props.photo)}
      width={props.photo.width || undefined}
      height={props.photo.height || undefined}
      loading={props.loading ?? "lazy"}
      sizes={props.sizes}
      class={props.class}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      onLoad={props.onLoad}
    />
  );
}
