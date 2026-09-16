/**
 * Canonical origin of the deployed site — no trailing slash.
 *
 * Used by metadata (OG / canonical URLs), sitemap.xml and robots.txt. These
 * three have to agree: if any one of them points somewhere else, search
 * engines and link unfurlers follow the wrong host.
 */
export const SITE_URL = "https://xiaooyang.com";
