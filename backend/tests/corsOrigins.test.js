const assert = require("node:assert/strict");
const test = require("node:test");

const {
  getAllowedOrigins,
  isAllowedOrigin,
  normalizeOrigin,
  splitOrigins,
} = require("../src/utils/corsOrigins");

test("normalizeOrigin removes a trailing slash", () => {
  assert.equal(
    normalizeOrigin("https://football-hub-five.vercel.app/"),
    "https://football-hub-five.vercel.app"
  );
});

test("splitOrigins supports comma-separated frontend URLs", () => {
  assert.deepEqual(
    splitOrigins("https://app.vercel.app, https://preview.vercel.app/"),
    ["https://app.vercel.app", "https://preview.vercel.app"]
  );
});

test("getAllowedOrigins includes local and deployed frontend URLs", () => {
  const allowedOrigins = getAllowedOrigins({
    FRONTEND_URL: "https://football-hub-five.vercel.app/",
    FRONTEND_URLS: "https://football-hub-preview.vercel.app",
  });

  assert.equal(allowedOrigins.includes("http://localhost:5173"), true);
  assert.equal(
    allowedOrigins.includes("https://football-hub-five.vercel.app"),
    true
  );
  assert.equal(
    allowedOrigins.includes("https://football-hub-preview.vercel.app"),
    true
  );
});

test("isAllowedOrigin allows exact deployed frontend origin", () => {
  const allowedOrigins = ["https://football-hub-five.vercel.app"];

  assert.equal(
    isAllowedOrigin("https://football-hub-five.vercel.app", allowedOrigins),
    true
  );
  assert.equal(
    isAllowedOrigin("https://other-site.vercel.app", allowedOrigins),
    false
  );
});
