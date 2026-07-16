# MedVirtual AI Asset Foundry — Setup (v1)

Private internal tool for generating **raw design ingredients** (faces, people, icons, callout badges) in controlled batches of four — not finished Meta ads.

**Page:** `/ai-asset-foundry.html`  
**Loop:** Generate raw kit → click to enlarge → **Download = keep + make 4 more like it** → approve/save as needed

Default lane: **Raw parts kit** (rotates face · talent · icons · callout). Never pink.

Honest labels: Preference-guided generation · Approval-informed prompting · MedVirtual taste profile. Votes do **not** fine-tune OpenAI models.

## Architecture (v1)

- Browser orchestrates **four sequential** one-image API requests
- Server: `POST /api/asset-foundry/generate` returns **one** PNG (base64) + metadata
- Persistence: **IndexedDB** in the browser (survives refresh)
- Save approved files via **File System Access API** into `public/assets/ai-approved/` (or download fallback)
- Local development unlocks without production password when `OPENAI_API_KEY` is present

## Local commands

```bash
cp .env.example .env.local
# set OPENAI_API_KEY and OPENAI_IMAGE_MODEL only to start

npm run assets:foundry-api   # http://localhost:3456
npm run dev                  # open /ai-asset-foundry.html
```

1. Click **Test connection (1× Draft)**
2. Then **Generate Four**

## Production

Set on Vercel:

- `OPENAI_API_KEY`
- `OPENAI_IMAGE_MODEL=gpt-image-2`
- `ASSET_FOUNDRY_PASSWORD`
- `ASSET_FOUNDRY_SESSION_SECRET`

Without password + session secret in production, generation shows:  
“Asset Foundry generation is not configured for this environment.”

## Formats (SDK-validated)

- Square `1024×1024`
- Portrait / Vertical `1024×1536`
- Landscape `1536×1024`

Quality modes: **Draft** (low) · **Review** (medium). High/Final deferred until the system is proven.

## Disable generation

Remove `OPENAI_API_KEY` or rotate the Foundry password.
