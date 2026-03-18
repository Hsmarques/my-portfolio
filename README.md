# my-portfolio

Portfolio site built with SolidJS, TailwindCSS, and Vite+.

## Commands

- `pnpm dev` - run the Vite+ dev server
- `pnpm build` - generate the photo manifest and build the SPA
- `pnpm preview` - preview the production build
- `pnpm check` - run the TypeScript checker

## Photo data

`scripts/generate-photos-manifest.mjs` now writes `public/photos-manifest.json` at build time.

- If Cloudinary credentials are available, the manifest is generated from the `my-portfolio` folder.
- Otherwise the manifest is generated from local files in `public/photos-optimized` or `public/photos`.
