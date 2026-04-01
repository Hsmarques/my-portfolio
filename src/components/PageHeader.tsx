import type { JSX } from "solid-js";

type PageHeaderProps = {
  title: string;
  subtitle?: JSX.Element;
  align?: "left" | "center";
  class?: string;
};

export default function PageHeader(props: PageHeaderProps) {
  const align = props.align ?? "center";
  const isCenter = align === "center";

  return (
    <header class={`mb-10 md:mb-12 ${props.class ?? ""}`}>
      <div class={isCenter ? "text-center" : ""}>
        <h1 class="font-serif text-4xl md:text-5xl text-white tracking-tight mb-4">
          {props.title}
        </h1>
        {props.subtitle && (
          <div
            class={`text-gray-400 text-base md:text-lg font-light leading-relaxed ${
              isCenter ? "max-w-2xl mx-auto" : "max-w-2xl"
            }`}
          >
            {props.subtitle}
          </div>
        )}
      </div>
    </header>
  );
}
