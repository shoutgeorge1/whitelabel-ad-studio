/**
 * ─────────────────────────────────────────────────────────────────────────
 *  WHITE-LABEL CONFIG — single source of truth for brand identity.
 *  Change these values to rebrand the entire generated studio (header, docs,
 *  home link, theme colors). This is the first file to edit for a new client
 *  or a new product direction (SaaS, agency, internal tool, etc.).
 * ─────────────────────────────────────────────────────────────────────────
 */
export const WHITE_LABEL = {
  /** Product / studio name shown in the header and docs. */
  name: 'Ad Studio',

  /** Short tagline under the name. */
  tagline: 'White-label ad & content production studio',

  /** Text mark (initials) used when no logo image is set. */
  mark: 'AS',

  /** Landing page the header logo links to. */
  homeHref: '/studio.html',

  /**
   * Header logo image path (served from /public). Leave '' to show the text
   * mark instead — good for a fresh, unbranded starting point.
   */
  logo: '',

  /** The end client / company this deployment is branded for. */
  client: {
    name: '',
    website: '',
  },

  /** Header theme colors — swap these to re-skin the whole nav. */
  theme: {
    headerBg: '#0B1F3A',
    headerBorder: '#077999',
    activeBg: '#077999',
    accent: '#00B2E2',
    actionBg: '#B8F000',
    actionInk: '#0B1F3A',
  },
};

export default WHITE_LABEL;
