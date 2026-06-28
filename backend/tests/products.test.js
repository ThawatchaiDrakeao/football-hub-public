const assert = require("node:assert/strict");
const test = require("node:test");
const Product = require("../src/models/Product");

test("Product model requires important storefront fields", () => {
  const product = new Product({});
  const error = product.validateSync();

  assert.equal(error.errors.name.message, "Product name is required");
  assert.equal(error.errors.description.message, "Product description is required");
  assert.equal(error.errors.price.message, "Product price is required");
});

test("Product model rejects negative price and stock", () => {
  const product = new Product({
    name: "Boots",
    description: "Football boots",
    price: -1,
    stock: -3,
  });
  const error = product.validateSync();

  assert.equal(error.errors.price.message, "Product price cannot be negative");
  assert.equal(error.errors.stock.message, "Product stock cannot be negative");
});

test("Product model keeps soft delete active by default", () => {
  const product = new Product({
    name: "Ball",
    description: "Match ball",
    price: 900,
  });

  assert.equal(product.isActive, true);
});
