import { createSignal, createEffect, onCleanup } from "solid-js";

interface KnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  size?: number;
  unit?: string;
  tooltip?: string;
}

export default function Knob(props: KnobProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [startY, setStartY] = createSignal(0);
  const [startValue, setStartValue] = createSignal(0);

  // Convert value to rotation angle (-135 to 135 degrees)
  const getRotation = () => {
    const normalized = (props.value - props.min) / (props.max - props.min);
    return -135 + normalized * 270;
  };

  // Format display value
  const getDisplayValue = () => {
    if (props.value >= 1000) {
      return `${(props.value / 1000).toFixed(1)}k`;
    }
    return props.value.toFixed(0);
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(props.value);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartValue(props.value);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging()) return;

    const deltaY = startY() - clientY;
    const sensitivity = (props.max - props.min) / 200;
    let newValue = startValue() + deltaY * sensitivity;
    newValue = Math.max(props.min, Math.min(props.max, newValue));
    props.onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);

  const handleEnd = () => {
    setIsDragging(false);
  };

  createEffect(() => {
    if (typeof window === "undefined") return;

    if (isDragging()) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    });
  });

  const size = () => props.size || 80;

  return (
    <div class="flex flex-col items-center gap-2 select-none group" title={props.tooltip}>
      {/* Label with tooltip indicator */}
      <div class="flex items-center gap-1">
        <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
          {props.label}
        </span>
        {props.tooltip && (
          <span
            class="text-[8px] text-gray-600 cursor-help opacity-50 group-hover:opacity-100 transition-opacity"
            title={props.tooltip}
          >
            ⓘ
          </span>
        )}
      </div>

      {/* Knob container */}
      <div
        class="relative cursor-grab active:cursor-grabbing"
        style={{ width: `${size()}px`, height: `${size()}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Outer ring / track */}
        <div
          class="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from -135deg,
              #D4AF37 0deg,
              #D4AF37 ${
                ((props.value - props.min) / (props.max - props.min)) * 270
              }deg,
              #333 ${
                ((props.value - props.min) / (props.max - props.min)) * 270
              }deg,
              #333 270deg,
              transparent 270deg
            )`,
            padding: "4px",
          }}
        >
          <div class="w-full h-full rounded-full bg-zinc-900" />
        </div>

        {/* Knob body */}
        <div
          class="absolute rounded-full transition-shadow duration-150"
          style={{
            inset: "6px",
            background: `
              radial-gradient(ellipse at 30% 30%, #555 0%, #222 50%, #111 100%)
            `,
            "box-shadow": isDragging()
              ? "0 0 20px rgba(212, 175, 55, 0.5), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.5)"
              : "0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.5)",
            transform: `rotate(${getRotation()}deg)`,
          }}
        >
          {/* Indicator line */}
          <div
            class="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full"
            style={{
              background: "#D4AF37",
              "box-shadow": "0 0 6px rgba(212, 175, 55, 0.8)",
            }}
          />
        </div>

        {/* Center cap */}
        <div
          class="absolute rounded-full"
          style={{
            inset: `${size() * 0.3}px`,
            background:
              "radial-gradient(ellipse at 40% 40%, #444 0%, #1a1a1a 100%)",
            "box-shadow": "inset 0 1px 2px rgba(255,255,255,0.1)",
          }}
        />
      </div>

      {/* Value display */}
      <div class="flex items-baseline gap-1">
        <span
          class="text-sm font-mono tabular-nums"
          style={{ color: "#D4AF37" }}
        >
          {getDisplayValue()}
        </span>
        {props.unit && (
          <span class="text-[10px] text-gray-500">{props.unit}</span>
        )}
      </div>
    </div>
  );
}
