import assert from "node:assert/strict";
import test from "node:test";
import {
  addImageUrl,
  isValidImageUrl,
  normalizeImageUrls,
  removeImageUrl,
} from "../src/utils/imageUrlManager.js";

test("isValidImageUrl accepts http and https URLs only", () => {
  assert.equal(isValidImageUrl("https://example.com/image.jpg"), true);
  assert.equal(isValidImageUrl("http://example.com/image.jpg"), true);
  assert.equal(isValidImageUrl("ftp://example.com/image.jpg"), false);
});

test("addImageUrl appends a valid image URL", () => {
  const result = addImageUrl([], "https://example.com/image.jpg");

  assert.equal(result.errorKey, "");
  assert.deepEqual(result.images, ["https://example.com/image.jpg"]);
});

test("addImageUrl rejects empty URLs", () => {
  const result = addImageUrl([], " ");

  assert.equal(result.errorKey, "admin.emptyImageUrl");
  assert.deepEqual(result.images, []);
});

test("addImageUrl rejects invalid URLs", () => {
  const result = addImageUrl([], "not-a-url");

  assert.equal(result.errorKey, "admin.invalidImageUrl");
  assert.deepEqual(result.images, []);
});

test("addImageUrl rejects duplicate URLs", () => {
  const imageUrl = "https://example.com/image.jpg";
  const result = addImageUrl([imageUrl], imageUrl);

  assert.equal(result.errorKey, "admin.duplicateImageUrl");
  assert.deepEqual(result.images, [imageUrl]);
});

test("removeImageUrl removes the selected URL", () => {
  const result = removeImageUrl(
    ["https://example.com/one.jpg", "https://example.com/two.jpg"],
    "https://example.com/one.jpg"
  );

  assert.deepEqual(result, ["https://example.com/two.jpg"]);
});

test("normalizeImageUrls keeps only usable string URLs", () => {
  assert.deepEqual(
    normalizeImageUrls([" https://example.com/image.jpg ", "", null, 123]),
    ["https://example.com/image.jpg"]
  );
});
