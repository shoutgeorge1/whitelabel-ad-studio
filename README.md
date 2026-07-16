# Ad Studio

One approved creative in. A placement-ready campaign pack out.

Ad Studio helps founders, media buyers, and lean agencies adapt finished ad
creative for feed, stories, reels, square, and display placements without
rebuilding every format by hand.

## Current product

- Upload a PNG, JPG, or WebP in the browser
- Preview 4:5, 9:16, 1:1, and 1.91:1 placements
- Adjust focus and zoom independently for every format
- See placement safe-zone overlays
- Preview subtle motion
- Export correctly sized PNGs individually or as a campaign pack

Files remain local to the browser in the current beta.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Product direction

The first paid offer is a high-touch $99 campaign pack:

- Four reviewed static adaptations
- Safe-zone and legibility QA
- One lightweight motion variation
- One revision round
- 48-hour target turnaround

The service validates demand and reveals which corrections should be automated
before subscriptions, accounts, or a large editor are built.

## Architecture

- `src/App.tsx` — customer-facing campaign-pack workflow
- `src/index.css` — responsive product site and workspace
- `scripts/` and `src/remotion/` — inherited production and motion R&D
- `public/` — inherited internal reference output; intentionally excluded from
  the production Vite build

## Next production milestones

1. Replace placeholder contact email and choose a product name/domain.
2. Add a real intake/payment flow for the high-touch pilot.
3. Add AI-assisted outpainting/recomposition with explicit customer review.
4. Render downloadable MP4 motion variations through Remotion.
5. Add accounts, project persistence, usage limits, and subscriptions only
   after repeat demand is demonstrated.
