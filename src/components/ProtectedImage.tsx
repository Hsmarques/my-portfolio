import type { JSX } from "solid-js";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
  style?: JSX.CSSProperties;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  onLoad?: (e: Event) => void;
  draggable?: boolean;
};

export default function ProtectedImage(props: Props) {
  return (
    <img
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      class={props.class}
      style={props.style}
      loading={props.loading}
      decoding={props.decoding ?? "async"}
      draggable={props.draggable ?? false}
      onLoad={props.onLoad}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}
