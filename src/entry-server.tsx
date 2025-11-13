// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#C19A6B" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet" />
          {assets}
        </head>
        <body class="font-sans">
          <div id="app" class="[&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif">{children}</div>
          <a href="https://www.buymeacoffee.com/hugosmarques" target="_blank" rel="noopener noreferrer" class="fixed bottom-4 z-50 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" class="h-[52px] md:h-[60px] w-auto" /></a>
          {scripts}
        </body>
      </html>
    )}
  />
));
