import assert from "node:assert/strict";
import test from "node:test";
import {
  clearAuthData,
  getSavedToken,
  getSavedUser,
  saveAuthData,
} from "../src/utils/authStorage.js";

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
};

test("saveAuthData stores token and user separately", () => {
  const storage = createMemoryStorage();
  const result = saveAuthData(
    {
      _id: "user1",
      name: "Fong",
      email: "fong@test.com",
      role: "admin",
      token: "jwt-token",
    },
    storage
  );

  assert.equal(result.nextToken, "jwt-token");
  assert.equal(getSavedToken(storage), "jwt-token");
  assert.deepEqual(getSavedUser(storage), {
    _id: "user1",
    name: "Fong",
    email: "fong@test.com",
    role: "admin",
  });
});

test("clearAuthData removes saved auth values", () => {
  const storage = createMemoryStorage();
  saveAuthData({ _id: "user1", token: "jwt-token" }, storage);

  clearAuthData(storage);

  assert.equal(getSavedToken(storage), "");
  assert.equal(getSavedUser(storage), null);
});

test("getSavedUser returns null for invalid JSON", () => {
  const storage = createMemoryStorage();
  storage.setItem("footyHubUser", "{bad json");

  assert.equal(getSavedUser(storage), null);
});
