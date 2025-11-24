import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import Nav from "~/components/Nav";
import { GlitchProvider, useGlitch } from "~/lib/GlitchContext";

import "./app.css";

function AppContent(props: any) {
  const { isBrutalistMode, isGlitching } = useGlitch();

  return (
    <div
      class={`${isBrutalistMode() ? "brutalist-mode" : ""} ${
        isGlitching() ? "glitch-active" : ""
      }`}
    >
      <Nav />
      <Suspense>{props.children}</Suspense>
    </div>
  );
}

export default function App() {
  inject();
  injectSpeedInsights();

  return (
    <GlitchProvider>
      <Router root={(props) => <AppContent {...props} />}>
        <FileRoutes />
      </Router>
    </GlitchProvider>
  );
}
