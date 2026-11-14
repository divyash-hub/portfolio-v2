# Divyash Agrawal — portfolio

A personal portfolio: who Divyash is and what he has built.

Built with Vite, React, TypeScript and React Router. Styling is plain CSS driven by design tokens. There is no backend, database or CMS: all content lives in two files in `src/data/`.

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
| Projects (archive, folders, case studies) | `src/data/projects.ts` |
| Name, email, links, About text, Capabilities, Experience, Lab, navigation | `src/data/site.ts` |
| Colours, type sizes, spacing, motion | `src/styles/tokens.css` |
| Original screenshots (full size) | `assets-source/` |
| Optimised images the site actually serves | `public/images/projects/<slug>/` |
| Pages | `src/pages/` |
| Shared components (nav, orbit hero, folder, project index, dice demo) | `src/components/` |
| The original brief and the two 21st.dev component references | `reference/` |

## The homepage scroll story

The homepage is driven by scrolling: the name splits apart, the About statement's words swing into place, a row of numbers counts up, "I build …" changes its ending, each project gets a full-screen colour panel that slides over the last, and four beats ("What if?" to "Yours next?") decode out of noise one at a time.

- The text for all of it is in `src/data/site.ts` (`about.statement`, `stats`, `builds`, `phases`).
- Each project's panel colours are its `tone` in `src/data/projects.ts`.
- The motion itself is in `src/pages/home-motion.ts`, using GSAP ScrollTrigger, with Lenis for smooth scrolling.
- Visitors who ask their device for reduced motion get the same content as a plain page.

## Contact form

The Contact page form posts to Formspree, which forwards each message to your inbox. The address it posts to is `formEndpoint` in `src/data/site.ts`.

## Add a project

1. **Images.** Save screenshots or photos in `assets-source/` named `<slug>-<name>.png`, for example `pc-builder-home.png`. Add the slug to the `SLUGS` list at the top of `scripts/optimise-images.mjs`, then run:

   ```bash
   npm run images
   ```

   This writes `public/images/projects/<slug>/<name>.webp` and a smaller `<name>-800.webp`.

2. **Content.** Open `src/data/projects.ts`, copy an existing entry in the `projects` array and edit it. The type definitions at the top of the file explain every field.

That is all. The homepage index, the folders on `/projects`, the list, the `/projects/<slug>` page and the previous/next links all read from that array.

Useful fields:

- `visibility: "draft"` keeps an entry off the public site entirely.
- `featured: true` shows it in the homepage index.
- `category` decides which folder it goes in. A new category needs adding to the `ProjectCategory` type and to `folderNames` in `src/pages/Projects.tsx`.
- `ownerNotes` is never shown on the site. Use it for facts that still need confirming.

If an entry is missing something required, the site throws a clear error naming the project.

## Replace or add project images

Put the new file in `assets-source/` with the same name and run `npm run images`. Screenshots are expected at 1440 × 900 (16:10).

For the Digital Electronic Dice, which has no photographs yet: add them as `assets-source/digital-electronic-dice-<name>.png`, run `npm run images`, then set `cover` and `gallery` on that entry.

## Experience and Lab pages

Both pages are built, but they only appear (route and navigation link) once they have content. Add verified entries to the `experience` or `lab` arrays in `src/data/site.ts` and they switch on by themselves.

## Deploying

Nothing has been deployed. The build output in `dist/` is a static site. Because project pages are real URLs, the host must send every path to `index.html`; `public/_redirects` (Netlify) and `vercel.json` (Vercel) already do this.

Before going live, once the domain is known: add a canonical URL and Open Graph image to `index.html`, and add a `sitemap.xml`.

## Facts still to confirm

These are also recorded as `ownerNotes` on each project.

- **Royal Wedding Planners / Ayush Raj:** exact scope (design, content, back end, hosting, maintenance), the full technology stack, and the year. Astro (RWP) and Bootstrap/jQuery (Ayush Raj) were read from the live sites' shipped files.
- **Digital Electronic Dice:** photographs, which parts were personally designed, wired, tested or presented, and whether teammates should be named.
- **About:** the course and year at Christ University. The old portfolio says "BCA, first year" but is out of date, so the site only says "I study at Christ University".
- **Capabilities:** React, Node.js, Express, MongoDB and Firebase appear on the old portfolio but have no project here to back them, so they are left out for now.
- **Certificates:** the old portfolio mentions eight without issuers or dates. None are published.
