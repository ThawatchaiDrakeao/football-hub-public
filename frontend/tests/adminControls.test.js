import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Products admin exposes Add Product and Edit Product controls", () => {
  const source = readSource("../src/admin/ProductAdmin.jsx");

  assert.match(source, /admin\.addProduct/);
  assert.match(source, /admin\.editProduct/);
});

test("Fields admin exposes Add Field and Edit Field controls", () => {
  const source = readSource("../src/admin/FieldAdmin.jsx");

  assert.match(source, /admin\.addField/);
  assert.match(source, /admin\.editField/);
});

test("Admin image manager supports preview and remove behavior", () => {
  const source = readSource("../src/admin/AdminImageManager.jsx");

  assert.match(source, /admin\.imagePreview/);
  assert.match(source, /admin\.removeImage/);
  assert.match(source, /onError/);
});
