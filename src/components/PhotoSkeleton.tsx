export default function PhotoSkeleton(props: { class?: string }) {
  return (
    <div
      class={`animate-pulse bg-[#181818]/8 ${props.class ?? "h-[60vh] w-full max-w-4xl"}`}
      aria-hidden="true"
    />
  );
}
