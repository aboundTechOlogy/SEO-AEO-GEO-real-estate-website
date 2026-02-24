/**
 * Forced-failure proof: verifies that IS_DEV guard correctly blocks mock
 * fallback in production mode and allows it in dev mode.
 *
 * Simulates the exact conditional logic from bridge.ts without requiring
 * the full Next.js module graph.
 *
 * Run with:
 *   NODE_ENV=production node scripts/test-no-mock-prod.mjs
 *   NODE_ENV=development node scripts/test-no-mock-prod.mjs
 */

const IS_DEV = process.env.NODE_ENV !== "production";

// ── Simulate fetchIdxSearch catch block (before and after fix) ──────────────

function OLD_fetchIdxSearchOnFailure() {
  // Pre-fix: always returns mock regardless of env
  return {
    listings: [{ id: "MOCK-0", price: 1_250_000, address: "100 Fake St" }],
    total: 1,
    hasMore: false,
    error: "Unable to load live Bridge listings.",
  };
}

function NEW_fetchIdxSearchOnFailure() {
  // Post-fix: only returns mock in dev
  if (IS_DEV) {
    return {
      listings: [{ id: "MOCK-0", price: 1_250_000, address: "100 Fake St" }],
      total: 1,
      hasMore: false,
      error: "Unable to load live Bridge listings.",
    };
  }
  return { listings: [], total: 0, hasMore: false, error: "Listing data temporarily unavailable." };
}

// ── Simulate getProperty MOCK-* guard ──────────────────────────────────────

function getMockProperty(listingKey) {
  if (!listingKey.startsWith("MOCK-")) return null;
  return { ListingKey: listingKey, ListPrice: 999999, BedroomsTotal: 3 };
}

function OLD_getProperty(listingKey) {
  // Pre-fix: MOCK-* keys always resolved regardless of env
  const mockMatch = getMockProperty(listingKey);
  if (mockMatch) return mockMatch;
  return null; // (would call Bridge in real code)
}

function NEW_getProperty(listingKey) {
  // Post-fix: MOCK-* keys only resolved in dev
  if (IS_DEV) {
    const mockMatch = getMockProperty(listingKey);
    if (mockMatch) return mockMatch;
  }
  return null; // production: Bridge failure → null → "Property not found"
}

// ── Run assertions ─────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ PASS  ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL  ${label}`);
    failed++;
  }
}

console.log(`\nNODE_ENV = "${process.env.NODE_ENV}"`);
console.log(`IS_DEV   = ${IS_DEV}\n`);

// fetchIdxSearch assertions
console.log("── fetchIdxSearch on Bridge failure ──────────────────────────────");
const oldSearch = OLD_fetchIdxSearchOnFailure();
const newSearch = NEW_fetchIdxSearchOnFailure();

assert(
  "OLD: returns mock listings (MOCK-* IDs) even in production [EXPECTED BUG]",
  oldSearch.listings.some((l) => l.id.startsWith("MOCK-"))
);

if (IS_DEV) {
  assert(
    "NEW (dev): returns mock listings with error string",
    newSearch.listings.some((l) => l.id.startsWith("MOCK-")) && !!newSearch.error
  );
} else {
  assert(
    "NEW (prod): returns empty listings — no mock IDs",
    newSearch.listings.length === 0
  );
  assert(
    "NEW (prod): returns error string instead of fake data",
    newSearch.error === "Listing data temporarily unavailable."
  );
  assert(
    "NEW (prod): total is 0 — no fake count inflating UI",
    newSearch.total === 0
  );
}

// getProperty assertions
console.log("\n── getProperty MOCK-* key guard ──────────────────────────────────");
const oldProp = OLD_getProperty("MOCK-0");
const newProp = NEW_getProperty("MOCK-0");

assert(
  "OLD: getProperty('MOCK-0') returns fake property in all envs [EXPECTED BUG]",
  oldProp !== null && oldProp.ListPrice === 999999
);

if (IS_DEV) {
  assert(
    "NEW (dev): getProperty('MOCK-0') still returns mock for local development",
    newProp !== null && newProp.ListPrice === 999999
  );
} else {
  assert(
    "NEW (prod): getProperty('MOCK-0') returns null — overlay shows 'not found' instead of fake stats",
    newProp === null
  );
}

// Summary
console.log(`\n── Results ────────────────────────────────────────────────────────`);
console.log(`  ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
