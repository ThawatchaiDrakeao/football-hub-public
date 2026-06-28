const assert = require("node:assert/strict");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const {
  buildAuthResponse,
  validateRegisterInput,
} = require("../src/controllers/authController");
const generateToken = require("../src/utils/generateToken");

test("generateToken signs a JWT with the user id", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test_secret_for_unit_tests";

  const token = generateToken("user123");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  assert.equal(decoded.id, "user123");
  assert.ok(decoded.exp);

  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});

test("generateToken fails clearly when JWT_SECRET is missing", () => {
  const previousSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  assert.throws(() => generateToken("user123"), /JWT_SECRET is required/);

  if (previousSecret !== undefined) {
    process.env.JWT_SECRET = previousSecret;
  }
});

test("register validation rejects passwords shorter than 8 characters", () => {
  assert.throws(
    () =>
      validateRegisterInput({
        name: "Demo User",
        email: "demo@example.com",
        password: "1234567",
      }),
    /Password must be at least 8 characters/
  );
});

test("register validation accepts passwords with 8 or more characters", () => {
  assert.doesNotThrow(() =>
    validateRegisterInput({
      name: "Demo User",
      email: "demo@example.com",
      password: "12345678",
    })
  );
});

test("auth response never includes password fields", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test_secret_for_unit_tests";

  const response = buildAuthResponse({
    _id: "user123",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    avatar: "",
    phone: "",
    password: "hashed-password-value",
  });

  assert.equal(response.password, undefined);
  assert.equal(response.passwordHash, undefined);
  assert.ok(response.token);

  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});
