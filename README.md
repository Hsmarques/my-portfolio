# my-portfolio

Portfolio site built with SolidJS, TailwindCSS, and Vite+.

## Commands

- `pnpm dev` - run the Vite+ dev server
- `pnpm build` - build the SPA
- `pnpm preview` - preview the production build
- `pnpm check` - run the TypeScript checker

## Photo data

Photos load from the Vercel runtime endpoint at `/api/photos`.

- Cloudinary credentials must be present in the deployment environment.
- The Cloudinary folder defaults to `my-portfolio` and can be overridden with `CLOUDINARY_FOLDER`.
