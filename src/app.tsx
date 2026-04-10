import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import Nav from "~/components/Nav";
import NotFound from "~/routes/[...404]";
import About from "~/routes/about";
import BlogPost from "~/routes/blog/[slug]";
import Blog from "~/routes/blog/index";
import Home from "~/routes/index";
import SinglePhotoPage from "~/routes/photo/[id]";
import PhotosPage from "~/routes/photos/index";
import SynthPage from "~/routes/synth";
import Homepage2 from "~/routes/homepage2";

import "./app.css";

export default function App() {
  inject();
  injectSpeedInsights();

  return (
    <Router
      root={(props) => (
        <>
          <Nav />
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/photos" component={PhotosPage} />
      <Route path="/photo/:id" component={SinglePhotoPage} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={About} />
      <Route path="/synth" component={SynthPage} />
      <Route path="/homepage2" component={Homepage2} />
      <Route path="*404" component={NotFound} />
    </Router>
  );
}
