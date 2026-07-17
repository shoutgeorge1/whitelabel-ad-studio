# Ad Studio OS

**https://adstudioos.com**

One master creative in. Google Display, YouTube, and Meta placement packs out.

Ad Studio OS is a browser-based production workbench for adapting finished creative
across common ad sizes without rebuilding every format by hand. Files stay local
to the browser.

## Product

- Upload a PNG, JPG, or WebP
- Switch between Google Display, Google Video, and Meta packs
- Adjust focus and zoom independently per format
- Choose cover or contain fit
- Review safe-zone guides and motion previews
- Name campaigns and check source-resolution readiness
- Restore the last campaign locally after a refresh
- Export PNG, JPG, or WebP stills individually or as one ZIP
- See selected-file size estimates against Google Display’s 150 KB soft limit
- Include a JSON manifest with formats, dimensions, and crop settings

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy

Production deploys from `main` to [adstudioos.com](https://adstudioos.com) via Vercel.

```bash
npm run build
npx vercel --prod
```

Static site assets live in `static/` (favicon, OG image, robots, sitemap).
Inherited internal HTML under `public/` is kept as source material and is not
copied into the production build.

## Architecture

- `src/App.tsx` — campaign-pack workflow
- `src/index.css` — product site and workspace
- `static/` — public production assets
- `scripts/` and `src/remotion/` — inherited production and motion R&D

## Next milestones

1. Cloud-saved projects and team handoff
2. Layout-aware reframing / outpainting with review
3. Downloadable MP4 motion variations
4. Accounts and usage limits only after repeat demand is clear
