import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import NotFound from "~/routes/[...404]";
import About from "~/routes/about";
import BlogPost from "~/routes/blog/[slug]";
import Blog from "~/routes/blog/index";
import Home from "~/routes/index";
import SinglePhotoPage from "~/routes/photo/[id]";
import PhotosPage from "~/routes/photos/index";
import SeriesPage from "~/routes/series/[slug]";
import SynthPage from "~/routes/synth";
import ThereminPage from "~/routes/theremin";
import Homepage3 from "~/routes/homepage3";

import "./app.css";

export default function App() {
  inject();
  injectSpeedInsights();

  return (
    <Router
      root={(props) => (
        <>
          <a
            href="#main"
            class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#181818] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <div id="main">
            <Suspense>{props.children}</Suspense>
          </div>
        </>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/photos" component={PhotosPage} />
      <Route path="/series/:slug" component={SeriesPage} />
      <Route path="/photo/:id" component={SinglePhotoPage} />
      <Route path="/about" component={About} />
      {/* Kept available but unlinked from the photo site chrome */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/synth" component={SynthPage} />
      <Route path="/theremin" component={ThereminPage} />
      <Route path="/homepage3" component={Homepage3} />
      <Route path="*404" component={NotFound} />
    </Router>
  );
}
