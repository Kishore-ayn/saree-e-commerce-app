/**
 * Shared Unsplash API helpers used by scripts/fetch-sarees.js and
 * scripts/fetch-theme-images.js. Keeping this in one place avoids the two
 * scripts drifting on license-filtering or download behaviour.
 */

const fs = require("fs/promises");

const API_BASE = "https://api.unsplash.com";

function getAccessKey() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.error("Missing UNSPLASH_ACCESS_KEY in .env — get one at https://unsplash.com/oauth/applications");
    process.exit(1);
  }
  return key;
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Authenticated GET against api.unsplash.com. Also used for the download_location ping. */
async function unsplashApiRequest(url, accessKey) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`Unsplash API ${res.status} ${res.statusText} for ${url} — ${body.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function searchPhotos(query, perPage, accessKey, { orientation = "portrait" } = {}) {
  const url = `${API_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}`;
  const data = await unsplashApiRequest(url, accessKey);
  return data.results || [];
}

/**
 * Getty/iStock syndicated results and Unsplash+ (paid) photos are not free-license.
 * A standard API key's /search/photos response doesn't expose a `premium` boolean today,
 * so the reliable signal is the asset host: Unsplash+ images are served from
 * plus.unsplash.com instead of images.unsplash.com. Both checks are kept for
 * forward-compatibility in case Unsplash starts returning an explicit flag.
 */
function isFreeLicense(photo) {
  if (photo.premium === true) return false;
  if (photo.user?.name?.toLowerCase().includes("getty images")) return false;
  try {
    if (new URL(photo.urls.raw).hostname === "plus.unsplash.com") return false;
  } catch {
    // malformed URL — fall through and treat as free-license
  }
  return true;
}

async function downloadImage(photo, destPath, { width = 800, quality = 80 } = {}) {
  const rawUrl = new URL(photo.urls.raw);
  rawUrl.searchParams.set("w", String(width));
  rawUrl.searchParams.set("q", String(quality));
  rawUrl.searchParams.set("fm", "webp");

  const res = await fetch(rawUrl.toString());
  if (!res.ok) {
    throw new Error(`Failed to download image (${res.status} ${res.statusText})`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destPath, buffer);
}

/** Required by Unsplash API guidelines: ping download_location once per download. */
async function pingDownloadLocation(photo, accessKey) {
  if (!photo.links?.download_location) return;
  await unsplashApiRequest(photo.links.download_location, accessKey);
}

async function loadJson(filePath, fallback = {}) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
}

function photoToManifestEntry(photo, fallbackAlt) {
  return {
    alt_description: photo.alt_description || photo.description || fallbackAlt,
    photographer: photo.user?.name ?? "Unknown",
    photographer_url: photo.user?.links?.html
      ? `${photo.user.links.html}?utm_source=saree-website&utm_medium=referral`
      : null,
  };
}

module.exports = {
  getAccessKey,
  slugify,
  sleep,
  fileExists,
  unsplashApiRequest,
  searchPhotos,
  isFreeLicense,
  downloadImage,
  pingDownloadLocation,
  loadJson,
  writeJson,
  photoToManifestEntry,
};
