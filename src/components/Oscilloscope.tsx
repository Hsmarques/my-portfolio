import { createSignal, createEffect, onCleanup, onMount } from "solid-js";

interface OscilloscopeProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export default function Oscilloscope(props: OscilloscopeProps) {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number | null = null;
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  const draw = () => {
    if (!canvasRef || !props.analyser) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = props.analyser;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationId = requestAnimationFrame(render);

      analyser.getByteTimeDomainData(dataArray);

      // Clear with fade effect for trail
      ctx.fillStyle = "rgba(13, 13, 13, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Vertical lines
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo((canvas.width / 4) * i, 0);
        ctx.lineTo((canvas.width / 4) * i, canvas.height);
        ctx.stroke();
      }

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = props.isPlaying ? "#D4AF37" : "#444";
      ctx.shadowColor = props.isPlaying ? "rgba(212, 175, 55, 0.5)" : "transparent";
      ctx.shadowBlur = props.isPlaying ? 8 : 0;

      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();
  };

  createEffect(() => {
    if (!isClient()) return;

    if (props.analyser) {
      draw();
    }

    onCleanup(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  });

  // Draw idle state when not playing
  createEffect(() => {
    if (!isClient() || !canvasRef) return;

    if (!props.isPlaying && !props.analyser) {
      const ctx = canvasRef.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0d0d0d";
        ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

        // Draw grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvasRef.height / 2);
        ctx.lineTo(canvasRef.width, canvasRef.height / 2);
        ctx.stroke();

        // Draw flat line
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvasRef.height / 2);
        ctx.lineTo(canvasRef.width, canvasRef.height / 2);
        ctx.stroke();
      }
    }
  });

  return (
    <div class="flex flex-col items-center gap-2">
      <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
        Oscilloscope
      </span>
      <div
        class="relative rounded-lg overflow-hidden"
        style={{
          background: "#0d0d0d",
          "box-shadow": `
            inset 0 2px 8px rgba(0, 0, 0, 0.8),
            0 1px 0 rgba(255, 255, 255, 0.05)
          `,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Scan line effect overlay */}
        <div
          class="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )`,
          }}
        />

        {/* Screen glare */}
        <div
          class="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
          }}
        />

        <canvas
          ref={canvasRef}
          width={280}
          height={100}
          class="block"
        />
      </div>
    </div>
  );
}

