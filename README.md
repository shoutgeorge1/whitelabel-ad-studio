# Ad Studio (white-label)

A white-label ad & content production studio — a static, self-contained site
generator for organizing creative work: dashboards, concept review, a component
library, aspect-ratio production, motion/video handoff, competitor research, and
copy/prompt libraries.

> Cloned from an internal ad-production project and stripped down to a reusable
> starting point. Rebrand it, point it at a client, or repurpose the engine for
> a SaaS/agency offering.

## Rebrand in one place

Edit [`brand.config.mjs`](./brand.config.mjs) to change the studio name,
tagline, logo, home link, and theme colors across every generated page. Leave
`logo: ''` to show a text mark instead of an image.

```js
export const WHITE_LABEL = {
  name: 'Ad Studio',
  tagline: 'White-label ad & content production studio',
  mark: 'AS',
  homeHref: '/studio.html',
  logo: '', // '' = text mark, or '/your-logo.svg'
  theme: { headerBg: '#0B1F3A', accent: '#00B2E2', /* ... */ },
};
```

## Quick start

```bash
npm install
npm run generate:vma   # build the site pages from /scripts data
npm run dev
```

Open [http://localhost:5173/studio.html](http://localhost:5173/studio.html)

## How it works

- Page content + data live in `scripts/*.mjs` (one module per section).
- `scripts/generate-*.mjs` render static HTML into `public/`.
- `scripts/shared-doc-header.mjs` renders the shared nav header, driven by
  `brand.config.mjs`.
- The root `motion-concept-lab.html` is a Vite + Remotion preview app.

## Scripts

```bash
npm run generate:vma           # Generate all site pages + motion lab + redirects
npm run generate:motion-lab    # Motion Concept Lab only
npm run remotion:studio        # Remotion Studio for MP4 renders
npm run lint                   # oxlint
```

## Where to refine next

- Swap remaining domain-specific copy/data in `scripts/*-data.mjs`.
- Replace sample assets under `public/` (images were excluded from this clone).
- Update navigation labels/links in `scripts/shared-doc-header.mjs` (`PRIMARY_NAV`).
