# PROJECT AUDIT — Raw Materials Direction

Local audit for MedVirtual Creative Handoff. **No secrets.** Do not commit `.env.local`.

**Audit date:** 2026-07-14  
**Branch:** `main`  
**Commit at audit start:** `2c272bce071f77cbb9e9a825d0d164be3d07b467`

## North star

Generate the parts. Show the intended result. Let the designers design.

This project supplies high-quality raw materials, clear art direction, and simple reference mockups. It does not replace Illustrator, Canva, CapCut, Premiere, or After Effects.

---

## Phase 1 — Safety

| Check | Result |
|---|---|
| `.env.local` ignored | Yes (`*.local`) |
| Tracked `OPENAI_API_KEY` / live `sk-` keys | None found in source |
| `VITE_OPENAI_API_KEY` | Not present |
| Build before simplification | Passed (`tsc -b && vite build`) |
| Destructive git | Not run |

Uncommitted work at audit (preserve — do not discard): Foundry (`api/`, `src/foundry/`), Vite/nav mods, `.env.example`, `docs/ASSET_FOUNDRY.md`, `tmp/` scrape dumps.

---

## Page inventory

### A — Graphics-team production (KEEP / primary nav)

| Page | Purpose | Classification |
|---|---|---|
| `/graphic-request-brief.html` | Current assignments | KEEP — rewritten clearer |
| `/template-test-board.html` | Layout examples | KEEP |
| `/role-offer-templates.html` | Role-Offer examples | KEEP (also Producer Lab) |
| `/real-people-creative.html` | Talent treatments | KEEP |
| `/real-people-assets.html` | Talent downloads | KEEP |
| `/raw-assets.html` | Raw component index | KEEP — **new graphics hub** |
| `/asset-hub.html` | Full logos/packages | KEEP (under Raw Assets) |
| `/image-variation-review.html` | Image board | KEEP |
| `/video-production.html` | Capture briefs | KEEP as Video Capture / reference Remotion |
| `/medvirtual-brand-guide.html` | Brand reference | KEEP |
| `/studio.html` | Entry + handoff steps | KEEP — simplified |

### B — Producer tools (Producer Lab)

| Page | Purpose | Classification |
|---|---|---|
| `/ideas.html` | Lab home | PRODUCER ONLY — relabeled |
| `/ai-asset-foundry.html` | Raw AI plates | PRODUCER ONLY — SIMPLIFY messaging |
| `/competitors.html` | Principle mining | PRODUCER ONLY |
| `/creative-concept-lab.html` | Static mock refs | PRODUCER ONLY — relabeled reference |
| `/motion-concept-lab.html` | Motion mock refs | PRODUCER ONLY — relabeled reference |
| `/mockup-sandbox.html` | Experiments | PRODUCER ONLY |
| `/saas-prop-templates.html` | Prop references | PRODUCER ONLY / SHARED refs |

### C — Reference / legacy (DEMOTE from primary nav; URLs kept)

| Page | Note |
|---|---|
| `/meta-launch-1.html`, `/meta-launch-2.html`, `/meta-launch-build-pack.html` | Media-buyer tooling — demoted |
| `/marketing-library.html` | Broader marketing — demoted |
| `/facebook-ad-copy.html` | Copy archive — demoted |
| `/contact-sheet-*.html` | Crop catalogs — demoted under secondary |
| `/index.html` | Vite shell — not graphics entry |

### D — Overlaps simplified (not deleted)

- Creative Lab vs Producer Lab naming → unified as **Producer Lab**
- Assets vs Image board → under **Raw Assets**
- Static/Motion “Concept Lab” → **Mock References** (art direction)

---

## Navigation after pass

**Primary:** Brief · Examples · People · Raw Assets · Video Capture · Producer Lab  
**Shelf:** Studio

Graphics should never see Foundry / Competitors / Sandbox as equal-weight production destinations.

---

## Feature classifications (summary)

| Tool | Verdict |
|---|---|
| Brief | SIMPLIFY language — done |
| Examples / People / Brand | KEEP |
| Raw Assets hub | KEEP — added |
| Video Capture | KEEP + clarify Remotion = reference |
| Foundry | PRODUCER ONLY + raw-components messaging |
| Static/Motion labs | DEMOTE + REFERENCE labels |
| Sandbox / Competitors | PRODUCER ONLY |
| Meta launch packs | ARCHIVE from primary nav (URL kept) |
| Cron auto-gen / Final quality | Remain unused / off |

---

## Working vs incomplete

**Working well:** Brief hopper data, Role-Offer DNA, Real People assets, Remotion previews, Foundry one-image API + IndexedDB (from prior pass), shared header generators.

**Overcomplicated before this pass:** Too many equal nav items; Brief inviting sandbox “cooler” work; labs sounding like mandatory editors; Foundry messaging leaning finished-ad.

**Simplified this pass:** Nav IA; Studio 5-step path; Brief tone; Lab labels; Raw Assets page; tomorrow review (localStorage on Studio).

**Incomplete (honest):** SVG icon library not newly built this pass; Foundry FS-folder persist across restarts limited; not all static HTML headers re-baked until `generate:docs` run; browser nav smoke not fully automated.

---

## Security notes

- OpenAI calls stay server-side (`/api/asset-foundry/*`).
- Production requires Foundry password + session secret.
- Pending/rejected images live in IndexedDB / private store — not the approved public library.
- Real-person reference mode stays consent-gated.
- Do not commit `tmp/` scrape dumps or `.local-masters/`.

---

## Local URLs for tomorrow

1. http://localhost:5173/studio.html  
2. http://localhost:5173/graphic-request-brief.html  
3. http://localhost:5173/raw-assets.html  
4. http://localhost:5173/ideas.html (Producer Lab)  
5. http://localhost:5173/ai-asset-foundry.html  
6. http://localhost:5173/creative-concept-lab.html  
7. http://localhost:5173/video-production.html  

Need API for Foundry: `npm run assets:foundry-api`

---

## Recommended next action (one)

Walk Studio → Brief → Raw Assets as a designer would, then open Producer Lab and score each section in the tomorrow-review dropdowns.

---

## Final report (2026-07-14 simplification pass)

1. **Branch / commit:** `main` @ `2c272bce071f77cbb9e9a825d0d164be3d07b467` (+ local uncommitted Foundry + IA changes)
2. **Build before:** Pass
3. **Build after:** Pass
4. **Already working:** Brief hopper, Role-Offer/People assets, Remotion refs, Foundry API (prior)
5. **Overcomplicated:** Equal-weight experimental nav; Brief inviting sandbox play; labs as mandatory editors
6. **Simplified:** Shared nav IA; Studio 5-step path; Brief wording; reference labels
7. **Moved to Producer Lab:** Foundry, Competitors, Static/Motion refs, Sandbox, SaaS Props, Role-Offer mockups
8. **Graphics-facing:** Brief, Examples, People, Raw Assets, Video Capture
9. **Relabeled reference-only:** Static Mock References, Motion Mock References, Video Capture (Remotion = reference)
10. **Demoted (URLs kept):** Meta launch packs, marketing library, contact sheets from primary nav
11. **Foundry:** Intact as producer raw-component tool; messaging tightened; no new OpenAI spend this pass
12. **OpenAI test this pass:** Skipped (not required) — prior connection + Generate Four succeeded in previous session
13. **Raw Asset Library:** `/raw-assets.html` added
14. **Video:** Capture-first subtitle; Remotion demoted in copy
15. **Incomplete:** SVG icon kit not newly authored; some less-used pages still need `generate:*` for latest nav; FS handle persistence
16. **Security:** `.env.local` ignored; no tracked live secrets; no `VITE_OPENAI_*`
17. **Created:** `PROJECT-AUDIT-RAW-MATERIALS.md`, `public/raw-assets.html`, `scripts/generate-raw-assets.mjs` (+ prior Foundry untracked set)
18. **Changed:** shared header, studio, brief, ideas, concept/motion/video generators, many regenerated HTML shells
19. **Not changed intentionally:** Remotion compositions, hopper assignment content, Role-Offer/Treatment DNA, private `_private/`, scrapes in `tmp/`
20. **Inspect tomorrow:** `/studio.html` · `/graphic-request-brief.html` · `/raw-assets.html` · `/ideas.html` · `/ai-asset-foundry.html`
21. **5-min checklist:** Studio steps → Brief card 1 downloads → Raw Assets → Producer Lab scores → Foundry open (no generate required)
22. **Next action only:** Score the Studio “tomorrow review” dropdowns after a designer-path walkthrough

