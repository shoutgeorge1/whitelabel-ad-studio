# Ad Studio

One master creative in. Google-ready display and video source packs out.

Ad Studio is currently an internal production workbench for adapting finished
creative across Google Display, YouTube, and optional Meta placements without
rebuilding every format by hand.

## Current product

- Upload a PNG, JPG, or WebP in the browser
- Switch between Google Display, Google Video, and Meta production packs
- Preview responsive-image, common banner, YouTube, Shorts, and social formats
- Adjust focus and zoom independently for every format
- See placement safe-zone overlays
- Preview subtle motion
- Name campaigns and inspect source-resolution readiness per placement
- Apply a tuned crop across a pack, then refine formats independently
- Choose cover or contain fit for extreme banners and placements
- Toggle safe-zone guides and motion previews during review
- Restore the most recent campaign and source image locally after a refresh
- Export PNG, JPG, or WebP stills individually or as one ZIP campaign pack
- See selected-file size estimates against Google Display’s 150 KB soft limit
- Include a JSON manifest with formats, dimensions, and crop settings

Files remain local to the browser in the current beta.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Product direction

The first goal is to make the tool reliably useful for its owner and employees:

- Six-format Google Display packs
- YouTube landscape, Shorts, and square-video source frames
- Optional four-format Meta packs
- Safe-zone and legibility QA
- Repeatable filenames and export workflow

External branding, customer intake, and monetization come after the internal
workflow repeatedly saves production time.

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
