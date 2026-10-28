import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import Footer from "~/components/Footer";
import Nav from "~/components/Nav";
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
        <div class="flex min-h-dvh flex-col bg-[#F7F6F2] text-[#181818]">
          <a
            href="#main"
            class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#F7F6F2] focus:px-3 focus:py-2 focus:text-sm"
          >
            Skip to content
          </a>
          <Nav />
          <div id="main" class="flex-1">
            <Suspense>{props.children}</Suspense>
          </div>
          <Footer />
        </div>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/photos" component={PhotosPage} />
      <Route path="/series/:slug" component={SeriesPage} />
      <Route path="/photo/:id" component={SinglePhotoPage} />
      <Route path="/about" component={About} />
      {/* Kept available by direct URL; unlinked from the photo site navigation. */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/synth" component={SynthPage} />
      <Route path="/theremin" component={ThereminPage} />
      <Route path="/homepage3" component={Homepage3} />
      <Route path="*404" component={NotFound} />
    </Router>
  );
}
