type SkeletonProps = {
  class?: string;
};

export default function Skeleton(props: SkeletonProps) {
  return (
    <div
      class={`animate-pulse bg-ink/10 ${props.class || ""}`}
      aria-hidden="true"
    />
  );
}

export function HomeSkeleton() {
  return (
    <div class="mx-auto max-w-6xl px-4 pt-32 pb-24 space-y-16">
      <div class="space-y-6 max-w-xl">
        <Skeleton class="h-12 w-3/4" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-6 w-2/3" />
      </div>
      <div class="grid gap-12 md:grid-cols-3">
        <Skeleton class="aspect-[4/3] w-full" />
        <Skeleton class="aspect-[4/3] w-full" />
        <Skeleton class="aspect-[4/3] w-full" />
      </div>
    </div>
  );
}

export function SeriesSkeleton() {
  return (
    <div class="space-y-16 pb-24">
      <div class="mx-auto max-w-3xl px-4 pt-32 space-y-4">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-12 w-2/3" />
        <Skeleton class="h-5 w-full" />
      </div>
      <Skeleton class="h-[70vh] w-full" />
      <div class="mx-auto max-w-6xl px-4 grid grid-cols-2 gap-8">
        <Skeleton class="aspect-[4/3] w-full" />
        <Skeleton class="aspect-[4/3] w-full" />
      </div>
    </div>
  );
}

export function PhotoSkeleton() {
  return (
    <div class="mx-auto max-w-5xl px-4 pt-28 pb-24 space-y-8">
      <Skeleton class="h-[70vh] w-full" />
      <Skeleton class="h-4 w-40" />
    </div>
  );
}
