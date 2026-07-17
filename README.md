# Ad Studio OS

**[adstudioos.com](https://adstudioos.com)**
**One creative. Every placement.**

Ad Studio OS is a local-first, component-based creative production system for
performance marketing teams. It turns an approved concept into a controlled
family of social and Google Display assets without exposing a freeform canvas
that can accidentally break the layout.

The public product page and quick crop workbench live at `/`. The structured
creative-production application lives at `/studio`.

## Working now

- Local project dashboard with create, reopen, duplicate, status, and confirmed delete
- Multiple persistent brand kits with logo, colors, fonts, CTA, disclaimer, and image notes
- Six data-driven template systems for headline, offer, proof, trust, problem/solution, and display work
- Structured copy fields: eyebrow, headline, highlighted phrase, support, offer, CTA, disclaimer
- Multiple named variants with language, version, color mode, and motion preset
- Campaign metadata: brand, campaign, concept, angle, audience, offer, language, funnel stage, and status
- Nine responsive placements:
  - Meta square (1:1), portrait feed (4:5), Story/Reel (9:16), and landscape (1.91:1)
  - Google Display 300×250, 336×280, 728×90, 300×600, and 320×50
- Placement-specific composition rules; extreme banners intentionally omit support/disclaimer copy
- Character and resolution warnings per placement
- Local imagery with normalized focal point, zoom, overlay, and optional brand tint
- Safe-area and actual-size display previews
- Family preview with placement selection and tune-in-studio links
- Restrained component motion previews with reduced-motion support
- PNG or JPEG export for the current placement
- Complete ZIP export with exact-size assets, `manifest.json`, `launch-sheet.csv`, and handoff README
- Versioned IndexedDB persistence and debounced autosave
- Existing image-crop pack workflow remains available on the homepage

## Local development

Requires Node 22+.

```bash
npm install
npm run dev
```

Open:

- Product page: [http://localhost:5173](http://localhost:5173)
- Studio: [http://localhost:5173/studio](http://localhost:5173/studio)

## Verification

```bash
npm run typecheck
npm run test
npm run lint
npm run build

# typecheck + tests + production build
npm run check
```

Vitest covers naming, copy constraints, display simplification, manifest/CSV
generation, deterministic SVG inputs, and independent project duplication.

## Architecture

The active customer product is deliberately separated from inherited campaign
R&D in the repository.

- `src/App.tsx` — public product page and legacy quick crop workbench
- `src/product/ProductApp.tsx` — application shell and local state orchestration
- `src/product/types.ts` — neutral, versioned domain types
- `src/product/data/catalog.ts` — centralized placements, templates, defaults, and demo seed
- `src/product/lib/storage.ts` — IndexedDB project/brand repository
- `src/product/lib/creative.ts` — naming, warnings, manifests, and CSV generation
- `src/product/lib/render.ts` — deterministic SVG scene and browser rasterization
- `src/product/lib/export.ts` — selected export and ZIP package creation
- `src/product/components/` — dashboard, brand kit, template library, studio, and preview UI
- `src/product/styles/product.css` — application-shell and studio styling
- `static/` — public icons, Open Graph image, robots, sitemap, and manifest

`public/`, `scripts/`, `src/remotion/`, and the older client-specific React
views are retained as internal research/source material. Vite serves `static/`
as its public directory, so inherited HTML is not copied into the customer build.
`.vercelignore` also excludes the inherited internal API and HTML archive from
the public deployment.

## Project data model

`CreativeProject` stores campaign metadata, one brand-kit reference, one
template, a selected placement set, status, and one or more `CreativeVariant`s.

Each variant stores:

- Structured `CreativeContent`
- Language and version
- Optional embedded local image plus focal point, zoom, overlay, and tint
- Color treatment
- Motion preset and duration

Projects use `schemaVersion: 2`. The browser database separates `projects`,
`brands`, and `settings` object stores. Invalid or older records are ignored
instead of crashing the application. The homepage's prior crop project remains
in its original database and is not deleted.

## Template definitions

Templates are typed records in `src/product/data/catalog.ts`. A definition
declares its strategy category, supported placements, motion eligibility,
default content, tags, and responsive visual family. The renderer combines the
template definition with a project, brand, variant, and placement.

Templates do not expose arbitrary layer positioning. Users edit approved slots
and controlled treatments. New templates should be added to the catalog and
rendered through the shared scene engine rather than by adding one-off pages.

## Placement definitions

Placement dimensions, platform, aspect family, safe inset, and copy guidance
are centralized in `PLACEMENTS`. Layout behavior branches on aspect family
(`square`, `portrait`, `story`, `landscape`, `rectangle`, `leaderboard`,
`half-page`, `mobile-banner`) rather than scattered width checks.

Leaderboard and mobile-banner scenes use a dedicated compact layout. They hide
nonessential support and disclaimer copy, cap the headline to one line, and
preserve a clear CTA.

## Rendering and export

Preview and export use the same `renderCreativeSvg()` output. The studio renders
that SVG inline so eligible components can animate. Static export loads the same
SVG into Canvas at the exact placement dimensions and encodes PNG or JPEG.

Family export produces:

```text
creative/
  BRAND_PLATFORM_CONCEPT_ANGLE_LANG_FORMAT_V01.png
manifest.json
launch-sheet.csv
README.txt
```

The manifest records project metadata, template, brand, placement dimensions,
variant/version, filenames, and placement warnings. Exports are real browser
downloads; failures surface in the export-center status region.

## Motion behavior

Working preview presets are `reveal`, `stagger`, `slow-zoom`, and `offer-pop`.
Templates explicitly declare eligible presets. Motion is CSS-based and applies
to named SVG components. `prefers-reduced-motion` suppresses animation.

Motion export is not implemented. PNG/JPEG files use the composed static frame,
and the interface says so. The direct future path is a server-side Remotion
adapter that consumes the same project/template/placement model.

## Known limitations

- Projects and assets are local to one browser; there is no account or cloud sync.
- Images are stored as data URLs, so very large project libraries may approach browser quota.
- Typography uses dependable browser/system font stacks, not uploaded brand-font files.
- Text fitting is bounded and deterministic but not a full typographic layout engine.
- Safe areas are template guidance, not platform-policy guarantees.
- No MP4/GIF export, AI generation, automatic translation, approvals, or collaboration.
- Existing internal R&D and API code remains in the repository but is not connected to the studio.

## Roadmap

### Next practical improvements

1. Asset resizing/deduplication and project import/export for reliable handoff
2. Per-placement content overrides for regulated disclaimers and banner-specific headlines
3. More template-specific layout families plus automated screenshot regression tests
4. Remotion adapter for verified MP4 motion export
5. Optional cloud repository behind the existing local repository boundary

### Long-term possibilities

- Team accounts, comments, approvals, and shared brand libraries
- Provider-based copy assistance and reviewed translation drafts
- Layout-aware outpainting/recomposition
- White-label configuration and agency workspaces
- Creative-performance metadata integrations

## Deployment

Production deploys from `main` to [adstudioos.com](https://adstudioos.com) through
Vercel. `/studio/*` rewrites to the Vite entry; `www` permanently redirects to
the apex domain.

```bash
npm run check
npx vercel --prod
```
