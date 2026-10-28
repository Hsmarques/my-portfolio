type Props = {
  class?: string;
};

export default function PhotoSkeleton(props: Props) {
  return (
    <div
      class={`bg-[#1F1F1F] animate-pulse ${props.class ?? ""}`}
      aria-hidden="true"
    />
  );
}
