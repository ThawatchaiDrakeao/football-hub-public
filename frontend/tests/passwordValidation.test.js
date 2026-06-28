import assert from "node:assert/strict";
import test from "node:test";
import {
  getPasswordLengthError,
  isPasswordLongEnough,
  passwordMinLength,
} from "../src/utils/passwordValidation.js";

test("password validation rejects passwords shorter than 8 characters", () => {
  assert.equal(passwordMinLength, 8);
  assert.equal(isPasswordLongEnough("1234567"), false);
});

test("password validation accepts passwords with 8 or more characters", () => {
  assert.equal(isPasswordLongEnough("12345678"), true);
  assert.equal(isPasswordLongEnough("strong-password"), true);
});

test("password validation provides a clear error message", () => {
  assert.equal(
    getPasswordLengthError(),
    "Password must be at least 8 characters."
  );
});
