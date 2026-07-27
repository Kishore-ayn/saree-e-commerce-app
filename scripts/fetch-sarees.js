#!/usr/bin/env node

/**
 * Fetches saree photos from the Unsplash API for use as placeholder product imagery.
 *
 * Usage: node scripts/fetch-sarees.js
 * Requires UNSPLASH_ACCESS_KEY in .env (see .env.example).
 */

require("dotenv").config();

const path = require("path");
const {
  getAccessKey,
  slugify,
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

const fs = require("fs/promises");

const ACCESS_KEY = getAccessKey();
const QUERIES = [
  "silk saree",
  "banarasi saree",
  "kanjivaram saree",
  "saree fabric texture",
  "indian bride saree",
];
const RESULTS_PER_QUERY = 6;
const RATE_LIMIT_MS = 1000;
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "sarees");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const existingManifest = await loadJson(MANIFEST_PATH);
  const manifest = { ...existingManifest };

  let downloaded = 0;
  let skippedLicense = 0;
  let skippedCached = 0;
  let failed = 0;

  for (const query of QUERIES) {
    console.log(`\nSearching Unsplash for "${query}"...`);

    let results;
    try {
      results = await searchPhotos(query, RESULTS_PER_QUERY, ACCESS_KEY);
    } catch (err) {
      console.error(`  Search failed: ${err.message}`);
      if (err.status === 401) {
        console.error("Unauthorized — check UNSPLASH_ACCESS_KEY and try again.");
        process.exit(1);
      }
      continue;
    }
    await sleep(RATE_LIMIT_MS);

    const slug = slugify(query);

    for (const [i, photo] of results.slice(0, RESULTS_PER_QUERY).entries()) {
      const filename = `${slug}-${i}.webp`;
      const destPath = path.join(OUTPUT_DIR, filename);

      if (!isFreeLicense(photo)) {
        console.log(`  [skip] ${filename} — ${photo.user?.name ?? "unknown"} (not free-license)`);
        skippedLicense += 1;
        continue;
      }

      if (existingManifest[filename] && (await fileExists(destPath))) {
        console.log(`  [cached] ${filename} — already downloaded`);
        skippedCached += 1;
        continue;
      }

      try {
        console.log(`  [download] ${filename} — photo ${photo.id} by ${photo.user?.name ?? "unknown"}`);
        await downloadImage(photo, destPath);
        await sleep(RATE_LIMIT_MS);

        await pingDownloadLocation(photo, ACCESS_KEY);
        await sleep(RATE_LIMIT_MS);

        manifest[filename] = photoToManifestEntry(photo, `${query} saree photo`);
        downloaded += 1;
      } catch (err) {
        console.error(`  [error] ${filename} — ${err.message}`);
        failed += 1;
      }
    }
  }

  await writeJson(MANIFEST_PATH, manifest);

  console.log(
    `\nDone. Downloaded ${downloaded}, cached ${skippedCached}, skipped (license) ${skippedLicense}, failed ${failed}.`
  );
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
