# Divyash Agrawal — portfolio

A personal portfolio: who Divyash is and what he has built.

Built with Vite, React, TypeScript and React Router, with GSAP (scroll animation) and Lenis (smooth scrolling). Styling is plain CSS driven by design tokens. There is no backend, database or CMS: all content lives in two files in `src/data/`.

## Run it

```bash
npm install
npm run dev      # development server at http://localhost:5173
npm run build    # type-check, then build the production site into dist/
npm run preview  # serve the production build locally
```

## Where things live

| What | Where |
| --- | --- |
| Projects (home panels, Projects page, case studies) | `src/data/projects.ts` |
| Name, email, links, About text, skills, experience, certificates, résumé link | `src/data/site.ts` |
| Colours, type sizes, spacing, motion | `src/styles/tokens.css` |
| Page transitions | `src/components/usePageTransitions.ts`, `src/styles/transitions.css` |
| Homepage scroll story | `src/pages/home-motion.ts` |
| Liquid glass nav | `src/components/Nav.tsx`, `src/components/liquidGlass.ts` |
| Original screenshots and photos (full size) | `assets-source/` |
| Optimised images the site serves | `public/images/` |

## Common edits

- **Résumé button:** paste the Google Drive share link into `resumeUrl` in `src/data/site.ts`. The buttons on About, Experience and Contact appear by themselves; a Drive link is turned into a direct download.
- **Add a project:** put screenshots in `assets-source/` named `<slug>-<name>.png`, add the slug to `SLUGS` in `scripts/optimise-images.mjs`, run `npm run images`, then copy an entry in `src/data/projects.ts`. Every listing, the case study page and previous/next links read from that array.
- **Photos kept out of the way:** a project's `hiddenPhotos` only show when a visitor clicks "Show the photos" (used for the dice breadboard).
- **Experience and certificates:** the `experience` and `certificates` arrays in `src/data/site.ts`.
- **Contact form:** posts to Formspree at `formEndpoint` in `src/data/site.ts`.

## Hidden things

- Type **warp** anywhere (or the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A) for the warp drive.
- Unknown addresses show the "Lost in orbit" 404 page.

## Browser notes

- The nav's refraction needs `backdrop-filter: url()`, which only Chromium browsers support. Safari and Firefox show frosted glass instead.
- Page transitions use the View Transitions API (Chromium and Safari 18+). Elsewhere pages change instantly.
- Everything that moves is switched off for visitors who ask their device for reduced motion.

## Deploying

The build output in `dist/` is a static site. `netlify.toml` sets the Netlify build (`npm run build`, publish `dist`), and `public/_redirects` sends every path to `index.html` so project pages work as real URLs.

Once the domain is known: add a canonical URL and an Open Graph share image to `index.html`, and add a `sitemap.xml`.
