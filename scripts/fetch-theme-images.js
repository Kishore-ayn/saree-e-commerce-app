#!/usr/bin/env node

/**
 * Fetches one hero photo each for a set of named site sections (homepage
 * category/occasion tiles, the navbar mega-menu's featured card and
 * "Collections" column, a couple of specific products, and the homepage
 * hero background) from the Unsplash API.
 *
 * Each item declares a *list* of queries, tried in order — the first query
 * whose results include a free-license candidate wins. This matters because
 * a single query can legitimately return zero usable results (too niche a
 * search term), and previously that just meant the item silently never got
 * an image. It also means a transient failure (e.g. an Unsplash rate limit)
 * on query N doesn't block trying query N+1 in the same run.
 *
 * Usage: node scripts/fetch-theme-images.js
 * Requires UNSPLASH_ACCESS_KEY in .env (see .env.example).
 */

require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const {
  getAccessKey,
  sleep,
  fileExists,
  searchPhotos,
  isFreeLicense,
  downloadImage,
  pingDownloadLocation,
  loadJson,
  writeJson,
  photoToManifestEntry,
} = require("./lib/unsplash");

const ACCESS_KEY = getAccessKey();
const RATE_LIMIT_MS = 1000;
const CANDIDATES_PER_QUERY = 5;
const IMAGES_ROOT = path.join(__dirname, "..", "public", "images");

// Queries are matched to this site's actual categories/occasions (see
// components/home/ShopByCategory.tsx and ShopByOccasion.tsx). Each item's
// `queries` list is tried in order until one yields a free-license photo.
const CATEGORY_ITEMS = [
  { key: "kanchipuram-silk", queries: ["kanchipuram saree", "kanjivaram silk saree", "south indian silk saree", "silk saree gold border"] },
  { key: "banarasi-sarees", queries: ["banarasi saree", "banarasi silk", "indian silk saree zari", "bridal silk saree"] },
  { key: "soft-silk-sarees", queries: ["silk saree drape"] },
  { key: "cotton-sarees", queries: ["cotton saree handloom"] },
  { key: "handloom-sarees", queries: ["handloom saree weaving"] },
  { key: "georgette-sarees", queries: ["chiffon saree flowy"] },
];

const OCCASION_ITEMS = [
  { key: "wedding", queries: ["indian bride saree ceremony"] },
  { key: "haldi", queries: ["haldi ceremony saree yellow"] },
  { key: "mehendi", queries: ["mehendi ceremony saree henna"] },
  { key: "sangeet", queries: ["sangeet ceremony", "indian dance celebration saree", "mehendi sangeet", "colorful saree celebration"] },
  { key: "reception", queries: ["indian wedding reception couple", "reception saree elegant", "evening gown saree"] },
  { key: "festive", queries: ["diwali celebration saree", "indian festival woman traditional", "festive saree"] },
];

const FEATURED_ITEMS = [{ key: "new-arrivals", queries: ["designer saree fashion", "new saree collection"] }];

const COLLECTION_ITEMS = [
  { key: "bridal-sarees", queries: ["indian bridal saree", "bride red saree", "wedding saree jewelry"] },
];

const PRODUCT_ITEMS = [
  { key: "uppada-silk-pastel-saree", queries: ["pastel saree", "peach saree", "light pink silk saree"] },
  { key: "organza-floral-print-saree", queries: ["organza saree", "floral print saree", "sheer floral saree"] },
  {
    key: "uppada-silk-jamdani-saree",
    queries: ["uppada jamdani silk saree", "teal silk saree wedding", "handloom silk saree teal gold", "jamdani saree"],
  },
];

const HERO_ITEMS = [
  { key: "hero-fabric-texture", queries: ["saree fabric texture"] },
  { key: "hero-silk-drape", queries: ["silk fabric draped"] },
  { key: "hero-saree-closeup", queries: ["saree close up elegant"] },
];

const GROUPS = [
  { name: "categories", items: CATEGORY_ITEMS, dir: path.join(IMAGES_ROOT, "categories") },
  { name: "occasions", items: OCCASION_ITEMS, dir: path.join(IMAGES_ROOT, "occasions") },
  { name: "featured", items: FEATURED_ITEMS, dir: path.join(IMAGES_ROOT, "featured") },
  { name: "collections", items: COLLECTION_ITEMS, dir: path.join(IMAGES_ROOT, "collections") },
  { name: "products", items: PRODUCT_ITEMS, dir: path.join(IMAGES_ROOT, "products") },
  { name: "hero", items: HERO_ITEMS, dir: path.join(IMAGES_ROOT, "hero") },
];

/** Tries each query in order; returns the first free-license candidate found, plus which query won. */
async function fetchOneFor(item) {
  for (const query of item.queries) {
    let results;
    try {
      results = await searchPhotos(query, CANDIDATES_PER_QUERY, ACCESS_KEY);
    } catch (err) {
      if (err.status === 401) throw err; // bad key — no point continuing at all
      console.error(`    [error] "${query}" search failed — ${err.message}`);
      await sleep(RATE_LIMIT_MS);
      continue;
    }
    await sleep(RATE_LIMIT_MS);

    let sawAnyResult = false;
    for (const photo of results) {
      sawAnyResult = true;
      if (!isFreeLicense(photo)) {
        console.log(`    [skip] "${query}" → ${photo.id} by ${photo.user?.name ?? "unknown"} — not free-license`);
        continue;
      }
      return { photo, query };
    }

    if (!sawAnyResult) {
      console.log(`    [zero-results] "${query}" returned no photos at all`);
    } else {
      console.log(`    [no-free-license] "${query}" returned photos, but none were free-license`);
    }
  }
  return null;
}

async function processGroup(group, manifest, existingManifest, stats) {
  console.log(`\n=== ${group.name} ===`);
  await fs.mkdir(group.dir, { recursive: true });

  for (const item of group.items) {
    const filename = `${item.key}.webp`;
    const destPath = path.join(group.dir, filename);

    console.log(`  ${item.key}`);

    if (existingManifest[filename] && (await fileExists(destPath))) {
      console.log(`    [cached] already downloaded`);
      manifest[filename] = existingManifest[filename];
      stats.cached += 1;
      continue;
    }

    let found;
    try {
      found = await fetchOneFor(item);
    } catch (err) {
      console.error(`    [fatal] ${err.message}`);
      if (err.status === 401) {
        console.error("Unauthorized — check UNSPLASH_ACCESS_KEY and try again.");
        process.exit(1);
      }
      stats.failed += 1;
      continue;
    }

    if (!found) {
      console.error(
        `    [NEEDS MANUAL FALLBACK] exhausted all ${item.queries.length} quer${item.queries.length === 1 ? "y" : "ies"} for "${item.key}" with no free-license result`
      );
      stats.needsFallback.push(`${group.name}/${item.key}`);
      stats.failed += 1;
      continue;
    }

    const { photo, query } = found;
    try {
      console.log(`    [download] "${query}" → photo ${photo.id} by ${photo.user?.name ?? "unknown"}`);
      await downloadImage(photo, destPath);
      await sleep(RATE_LIMIT_MS);

      await pingDownloadLocation(photo, ACCESS_KEY);
      await sleep(RATE_LIMIT_MS);

      manifest[filename] = photoToManifestEntry(photo, `${query} photo`);
      stats.downloaded += 1;
    } catch (err) {
      console.error(`    [error] ${err.message}`);
      stats.failed += 1;
    }
  }
}

async function main() {
  const stats = { downloaded: 0, cached: 0, failed: 0, needsFallback: [] };

  for (const group of GROUPS) {
    const manifestPath = path.join(group.dir, "manifest.json");
    const existingManifest = await loadJson(manifestPath);
    const manifest = { ...existingManifest };

    await processGroup(group, manifest, existingManifest, stats);

    await writeJson(manifestPath, manifest);
    console.log(`  Manifest: ${manifestPath}`);
  }

  console.log(`\nDone. Downloaded ${stats.downloaded}, cached ${stats.cached}, failed ${stats.failed}.`);
  if (stats.needsFallback.length > 0) {
    console.log(`\nNeeds manual fallback (no free-license result across all queries tried):`);
    for (const item of stats.needsFallback) console.log(`  - ${item}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
