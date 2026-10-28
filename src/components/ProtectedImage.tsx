import type { JSX } from "solid-js";

type ProtectedImageProps = Omit<
  JSX.ImgHTMLAttributes<HTMLImageElement>,
  "draggable"
> & {
  src: string;
  alt: string;
};

export default function ProtectedImage(props: ProtectedImageProps) {
  return (
    <img
      {...props}
      draggable={false}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    />
  );
}
