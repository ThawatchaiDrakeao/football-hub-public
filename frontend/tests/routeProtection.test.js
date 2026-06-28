import assert from "node:assert/strict";
import test from "node:test";
import {
  getAdminRouteDecision,
  getProtectedRouteDecision,
} from "../src/utils/routeAccess.js";

test("protected route waits while auth is loading", () => {
  assert.equal(
    getProtectedRouteDecision({ isAuthenticated: false, loading: true }),
    "loading"
  );
});

test("protected route redirects logged-out users to login", () => {
  assert.equal(
    getProtectedRouteDecision({ isAuthenticated: false, loading: false }),
    "login"
  );
});

test("protected route allows logged-in users", () => {
  assert.equal(
    getProtectedRouteDecision({ isAuthenticated: true, loading: false }),
    "allow"
  );
});

test("admin route redirects non-admin users home", () => {
  assert.equal(
    getAdminRouteDecision({
      isAuthenticated: true,
      loading: false,
      user: { role: "user" },
    }),
    "home"
  );
});

test("admin route allows admin users", () => {
  assert.equal(
    getAdminRouteDecision({
      isAuthenticated: true,
      loading: false,
      user: { role: "admin" },
    }),
    "allow"
  );
});
