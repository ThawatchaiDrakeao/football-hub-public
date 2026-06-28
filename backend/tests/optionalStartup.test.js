const assert = require("node:assert/strict");
const test = require("node:test");

const { isOptionalSupabaseError } = require("../src/utils/optionalStartup");

test("detects Supabase DNS startup errors as optional", () => {
  const error = new Error(
    "TypeError: fetch failed getaddrinfo ENOTFOUND example-project.supabase.co"
  );
  error.code = "ENOTFOUND";
  error.hostname = "example-project.supabase.co";

  assert.equal(isOptionalSupabaseError(error), true);
});

test("does not mark unrelated errors as optional Supabase errors", () => {
  const error = new Error("MongoDB connection error");
  error.code = "ECONNREFUSED";

  assert.equal(isOptionalSupabaseError(error), false);
});
