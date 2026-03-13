import { createClient } from "contentful";

// ─── Client ──────────────────────────────────────────────────────
const isConfigured =
  process.env.CONTENTFUL_SPACE_ID &&
  process.env.CONTENTFUL_SPACE_ID !== "your_space_id" &&
  process.env.CONTENTFUL_ACCESS_TOKEN &&
  process.env.CONTENTFUL_ACCESS_TOKEN !== "your_access_token";

const client = isConfigured
  ? createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    })
  : null;

// ─── App-level type (what components consume) ────────────────────
// Mirrors the shape of data/content.ts so the JSON field is a 1:1 match
export interface LandingPageContent {
  slug: string;
  hero: {
    headline: string;
    headlineAccent: string;
    description: string;
    rating: string;
    memberCount: string;
    ctaText: string;
    heroImage: string; // Contentful CDN URL or local /public path
  };
  momentsCopy: {
    blocks: { text: string; accent: string }[];
  };
  whatIsMarzi: {
    heading: string;
    headingAccent: string;
    cards: Record<string, unknown>;
  };
  ctaBanner: {
    heading: string;
    subtitle: string;
    ctaText: string;
    bgImage: string;
  };
  testimonials: {
    items: { image: string; quote: string; name: string }[];
  };
}

// ─── Fetchers ────────────────────────────────────────────────────
export async function getLandingPage(
  slug: string,
): Promise<LandingPageContent | null> {
  if (!client) return null;

  const res = await client.getEntries({
    content_type: "downloadLandingPage",
    "fields.slug": slug,
    limit: 1,
  });

  const entry = res.items[0];
  if (!entry) return null;

  const fields = entry.fields as unknown as {
    slug: string;
    content: Omit<LandingPageContent, "slug">;
  };

  return {
    slug: fields.slug,
    ...fields.content,
  };
}

export async function getAllLandingSlugs(): Promise<string[]> {
  if (!client) return [];

  const res = await client.getEntries({
    content_type: "downloadLandingPage",
    select: ["fields.slug"],
    limit: 100,
  });

  return res.items.map(
    (e) => (e.fields as unknown as { slug: string }).slug,
  );
}
