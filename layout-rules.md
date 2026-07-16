# Layout Rules — MedVirtual Meta Ads

## Template selection

| Template | Code | Use when |
|----------|------|----------|
| A — Split | `split` | Portrait fills frame; copy on opposite side. **No text on face.** |
| B — Bottom band | `bottom-band` | Clear space below chest; band ≤30% height. Verify chin clearance. |
| C — Top hook | `top-hook` | Centered subject with space above/below. Hook top, CTA bottom. |
| D — Side rail | `side-rail` | Busy office scene; white rail on open side. |
| E — Comparison | `comparison` | Cost/staffing angles; no portrait required. |

## Image treatment

- No heavy teal/blue overlays on portraits.
- Light contrast boost only (`filter: contrast(1.04)`).
- Faces natural and unobstructed.
- Website-ripped images in `/public/assets/reference-only/` — **reference only**.

## Text rules

- Hook: largest text on image.
- Max 3 bullets; ~7 words each.
- 48px minimum padding on export canvas.
- 40px minimum margin from edges.
- Official logo from `/public/assets/logo/medvirtual-logo.svg`.

## Face safety

If text may overlap chin/neck, set `layout_warning` and status `Needs layout review`.
