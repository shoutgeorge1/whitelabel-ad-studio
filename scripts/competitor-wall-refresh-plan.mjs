/**
 * Refresh Competitor Wall from Meta Ad Library (cloud agent / local).
 *
 * Flow for scheduled automation:
 * 1. For each brand in COMPETITOR_ADS, open Meta Ad Library US search.
 * 2. Extract Library ID, primary text, headline, description, CTA, creative image URLs.
 * 3. Prefer ads whose advertiser name matches the brand (skip keyword junk).
 * 4. Write images under public/assets/competitors/live/{id}-{n}.jpg
 * 5. Update public/assets/competitors/live-snapshots.json
 * 6. Run: npm run generate:competitors
 * 7. Commit + push to main so Vercel rebuilds.
 *
 * Brands: hello-rache, weave, time-doc, nexhealth, zocdoc, carerev, patientpop, generic-va-commodity
 */
import { COMPETITOR_ADS, adLibraryUrl } from './competitor-ads-data.mjs';

export function refreshPlan() {
  return COMPETITOR_ADS.flatMap((ad) => {
    const queries =
      Array.isArray(ad.adLibraryQueries) && ad.adLibraryQueries.length
        ? ad.adLibraryQueries
        : [ad.adLibraryQuery];
    return queries.map((query, i) => ({
      id: ad.id,
      name: ad.name,
      preferAdvertiser: ad.name.split('/')[0].trim(),
      url: adLibraryUrl(query),
      query,
      queryIndex: i,
    }));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(refreshPlan(), null, 2));
}
