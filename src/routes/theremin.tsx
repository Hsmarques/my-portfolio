import type {
  HandLandmarker as HandLandmarkerInstance,
  HandLandmarkerResult,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";

import {
  createChromaticScale,
  getNoteLabelPosition,
  getRingHit,
  type Point,
  type RingHit,
  type RingLayout,
} from "~/lib/handRing";
import { HandRingAudio } from "~/lib/handRingAudio";

const MEDIAPIPE_VERSION = "0.10.35";
const WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";

type RingId = RingLayout["id"];

interface ActiveRingHit {
  point: Point;
  hit: RingHit;
}

interface FingerPoint {
  id: string;
  point: Point;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const createEmptyHits = (): Record<RingId, ActiveRingHit | null> => ({
  left: null,
  right: null,
});

const getVideoPoint = (
  landmark: NormalizedLandmark,
  video: HTMLVideoElement,
  stageRect: DOMRect,
): Point => {
  const videoRect = video.getBoundingClientRect();
  const videoAspect = video.videoWidth / video.videoHeight;
  const elementAspect = videoRect.width / videoRect.height;

  if (!Number.isFinite(videoAspect) || videoAspect === 0) {
    return {
      x: videoRect.left - stageRect.left + (1 - landmark.x) * videoRect.width,
      y: videoRect.top - stageRect.top + landmark.y * videoRect.height,
    };
  }

  const content =
    videoAspect > elementAspect
      ? {
          width: videoRect.height * videoAspect,
          height: videoRect.height,
          x: (videoRect.width - videoRect.height * videoAspect) / 2,
          y: 0,
        }
      : {
          width: videoRect.width,
          height: videoRect.width / videoAspect,
          x: 0,
          y: (videoRect.height - videoRect.width / videoAspect) / 2,
        };

  const mirroredX = content.x + (1 - landmark.x) * content.width;

  return {
    x: videoRect.left - stageRect.left + mirroredX,
    y: videoRect.top - stageRect.top + content.y + landmark.y * content.height,
  };
};

const createHandLandmarker = async () => {
  const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
  const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);

  return HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: HAND_MODEL_URL,
      delegate: "CPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.35,
    minHandPresenceConfidence: 0.35,
    minTrackingConfidence: 0.35,
  });
};

export default function ThereminPage() {
  let stageRef: HTMLDivElement | undefined;
  let videoRef: HTMLVideoElement | undefined;
  let animationFrame = 0;
  let videoStream: MediaStream | null = null;
  let handLandmarker: HandLandmarkerInstance | null = null;
  let audio: HandRingAudio | null = null;
  let lastVideoTime = -1;

  const [isClient, setIsClient] = createSignal(false);
  const [isStarting, setIsStarting] = createSignal(false);
  const [isRunning, setIsRunning] = createSignal(false);
  const [status, setStatus] = createSignal("Start the camera, then move an index finger into a note ring.");
  const [stageSize, setStageSize] = createSignal({ width: 1280, height: 720 });
  const [activeHits, setActiveHits] = createSignal(createEmptyHits());
  const [detectedFingers, setDetectedFingers] = createSignal<FingerPoint[]>([]);
  const [trackingSummary, setTrackingSummary] = createSignal("No hands detected yet.");

  const rings = createMemo<RingLayout[]>(() => {
    const { width, height } = stageSize();
    const outerRadius = clamp(Math.min(width * 0.2, height * 0.27), 70, 190);
    const innerRadius = outerRadius * 0.45;
    const centerY = height * 0.55;

    return [
      {
        id: "left",
        label: "Low hand",
        center: { x: width * 0.28, y: centerY },
        innerRadius,
        outerRadius,
        notes: createChromaticScale(3),
      },
      {
        id: "right",
        label: "High hand",
        center: { x: width * 0.72, y: centerY },
        innerRadius,
        outerRadius,
        notes: createChromaticScale(4),
      },
    ];
  });

  onMount(() => {
    setIsClient(true);

    if (!stageRef) return;

    const updateStageSize = () => {
      const rect = stageRef?.getBoundingClientRect();
      if (!rect) return;
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateStageSize();

    const observer = new ResizeObserver(updateStageSize);
    observer.observe(stageRef);
    onCleanup(() => observer.disconnect());
  });

  const stopEverything = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    audio?.stop("left");
    audio?.stop("right");
    audio?.dispose();
    audio = null;
    handLandmarker?.close();
    handLandmarker = null;
    videoStream?.getTracks().forEach((track) => track.stop());
    videoStream = null;
    lastVideoTime = -1;
    setActiveHits(createEmptyHits());
    setDetectedFingers([]);
    setTrackingSummary("No hands detected yet.");
    setIsRunning(false);
  };

  onCleanup(stopEverything);

  const applyFrameResult = (result: HandLandmarkerResult) => {
    if (!stageRef || !videoRef || !audio) return;

    const stageRect = stageRef.getBoundingClientRect();
    const nextHits = createEmptyHits();
    const nextFingers: FingerPoint[] = [];

    result.landmarks.forEach((landmarks, handIndex) => {
      const indexTip = landmarks[8];
      if (!indexTip) return;

      const point = getVideoPoint(indexTip, videoRef, stageRect);
      nextFingers.push({ id: `hand-${handIndex}`, point });

      const hits = rings()
        .map((ring) => ({ ring, hit: getRingHit(point, ring) }))
        .filter((entry): entry is { ring: RingLayout; hit: RingHit } => entry.hit !== null)
        .sort((a, b) => a.hit.distance - b.hit.distance);

      const match = hits.find(({ ring }) => nextHits[ring.id] === null);
      if (match) {
        nextHits[match.ring.id] = { point, hit: match.hit };
      }
    });

    (["left", "right"] as const).forEach((ringId) => {
      const active = nextHits[ringId];
      if (active) {
        audio?.play(ringId, active.hit.note);
      } else {
        audio?.stop(ringId);
      }
    });

    setActiveHits(nextHits);
    setDetectedFingers(nextFingers);
    setTrackingSummary(
      nextFingers.length === 0
        ? "No hands detected. Keep both hands visible and well lit."
        : `${nextFingers.length} hand${nextFingers.length === 1 ? "" : "s"} detected. ${
            Object.values(nextHits).filter(Boolean).length
          } ring${Object.values(nextHits).filter(Boolean).length === 1 ? "" : "s"} playing.`,
    );
  };

  const runDetectionLoop = () => {
    if (!videoRef || !handLandmarker) return;

    if (videoRef.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && videoRef.currentTime !== lastVideoTime) {
      lastVideoTime = videoRef.currentTime;
      const result = handLandmarker.detectForVideo(videoRef, performance.now());
      applyFrameResult(result);
    }

    animationFrame = requestAnimationFrame(runDetectionLoop);
  };

  const startTheremin = async () => {
    if (isRunning() || isStarting()) return;

    try {
      setIsStarting(true);
      setStatus("Requesting camera access...");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser does not support camera access.");
      }

      if (!videoRef) {
        throw new Error("Video element is not ready yet.");
      }

      audio = new HandRingAudio();
      await audio.resume();

      videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      videoRef.srcObject = videoStream;
      await videoRef.play();

      setStatus("Loading hand tracker...");
      handLandmarker = await createHandLandmarker();
      setStatus("Tracking is running. Move both index fingertips onto the note rings.");
      setIsRunning(true);
      runDetectionLoop();
    } catch (error) {
      stopEverything();
      setStatus(error instanceof Error ? error.message : "Could not start the theremin.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <main class="min-h-screen bg-surface text-bacalhau overflow-hidden">
      <Show
        when={isClient()}
        fallback={
          <div class="min-h-screen flex items-center justify-center">
            <span class="text-sm uppercase tracking-[0.2em] text-vinho-300">Initializing...</span>
          </div>
        }
      >
        <div
          ref={stageRef}
          class="relative h-screen w-screen overflow-hidden bg-surface"
          aria-label="Hidden hand controlled theremin"
        >
          <video
            ref={videoRef}
            class="absolute inset-0 h-full w-full object-cover opacity-55 scale-x-[-1]"
            autoplay
            muted
            playsinline
          />

          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,158,8,0.08),rgba(26,15,20,0.72)_62%,rgba(26,15,20,0.94))]" />

          <svg
            class="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${stageSize().width} ${stageSize().height}`}
            role="img"
            aria-label="Two circular note rings"
          >
            <For each={rings()}>
              {(ring) => {
                const active = () => activeHits()[ring.id];

                return (
                  <g>
                    <circle
                      cx={ring.center.x}
                      cy={ring.center.y}
                      r={ring.outerRadius}
                      fill="rgba(89,37,50,0.24)"
                      stroke={active() ? "rgba(212,158,8,0.92)" : "rgba(255,240,209,0.32)"}
                      stroke-width="2"
                    />
                    <circle
                      cx={ring.center.x}
                      cy={ring.center.y}
                      r={ring.innerRadius}
                      fill="rgba(26,15,20,0.68)"
                      stroke="rgba(255,240,209,0.2)"
                      stroke-width="1"
                    />
                    <For each={ring.notes}>
                      {(note, index) => {
                        const labelPoint = () => getNoteLabelPosition(ring, index());
                        const linePoint = () => getNoteLabelPosition(ring, index(), ring.outerRadius);
                        const activeNote = () => active()?.hit.note.note === note.note;

                        return (
                          <g>
                            <line
                              x1={ring.center.x}
                              y1={ring.center.y}
                              x2={linePoint().x}
                              y2={linePoint().y}
                              stroke="rgba(255,240,209,0.12)"
                              stroke-width="1"
                            />
                            <text
                              x={labelPoint().x}
                              y={labelPoint().y}
                              text-anchor="middle"
                              dominant-baseline="middle"
                              fill={activeNote() ? "#D49E08" : "rgba(255,240,209,0.76)"}
                              font-size={activeNote() ? "18" : "14"}
                              font-weight={activeNote() ? "700" : "500"}
                            >
                              {note.note.replace(/\d$/, "")}
                            </text>
                          </g>
                        );
                      }}
                    </For>
                    <text
                      x={ring.center.x}
                      y={ring.center.y - 8}
                      text-anchor="middle"
                      fill="rgba(255,240,209,0.78)"
                      font-size="13"
                      font-weight="700"
                      letter-spacing="2"
                    >
                      {ring.label}
                    </text>
                    <text
                      x={ring.center.x}
                      y={ring.center.y + 16}
                      text-anchor="middle"
                      fill={active() ? "#D49E08" : "rgba(255,240,209,0.48)"}
                      font-size="20"
                      font-weight="700"
                    >
                      {active()?.hit.note.note ?? "REST"}
                    </text>
                    <Show when={active()}>
                      {(activeHit) => (
                        <circle
                          cx={activeHit().point.x}
                          cy={activeHit().point.y}
                          r="10"
                          fill="#D49E08"
                          stroke="#FFF0D1"
                          stroke-width="2"
                        />
                      )}
                    </Show>
                  </g>
                );
              }}
            </For>
            <For each={detectedFingers()}>
              {(finger) => (
                <g>
                  <circle
                    cx={finger.point.x}
                    cy={finger.point.y}
                    r="18"
                    fill="rgba(212,158,8,0.16)"
                    stroke="rgba(255,240,209,0.7)"
                    stroke-width="2"
                  />
                  <circle cx={finger.point.x} cy={finger.point.y} r="4" fill="#FFF0D1" />
                </g>
              )}
            </For>
          </svg>

          <section class="absolute left-1/2 top-24 z-10 w-[min(92vw,34rem)] -translate-x-1/2 rounded-2xl border border-superbock-400/20 bg-surface/72 px-5 py-4 text-center shadow-2xl backdrop-blur-md">
            <p class="font-serif text-2xl font-bold tracking-tight text-bacalhau">Hand Theremin</p>
            <p class="mt-2 text-sm leading-6 text-bacalhau-200">{status()}</p>
            <Show when={isRunning()}>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-superbock-300">
                {trackingSummary()}
              </p>
            </Show>
            <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startTheremin}
                disabled={isStarting() || isRunning()}
                class="rounded-full bg-superbock-400 px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-vinho-950 transition hover:bg-superbock-300 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isStarting() ? "Starting..." : isRunning() ? "Running" : "Start"}
              </button>
              <Show when={isRunning()}>
                <button
                  type="button"
                  onClick={() => {
                    stopEverything();
                    setStatus("Stopped. Start again when you want to play.");
                  }}
                  class="rounded-full border border-bacalhau-200/30 px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-bacalhau-100 transition hover:border-superbock-400/70 hover:text-superbock-400"
                >
                  Stop
                </button>
              </Show>
            </div>
          </section>

          <div class="pointer-events-none absolute bottom-8 left-1/2 z-10 w-[min(92vw,42rem)] -translate-x-1/2 rounded-full border border-bacalhau-100/10 bg-surface/55 px-5 py-3 text-center text-xs uppercase tracking-[0.2em] text-bacalhau-200 backdrop-blur-md">
            Index finger in the ring plays notes. Center and outside the ring are silent.
          </div>
        </div>
      </Show>
    </main>
  );
}
