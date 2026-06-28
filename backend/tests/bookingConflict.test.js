const assert = require("node:assert/strict");
const test = require("node:test");
const {
  calculateBookingHours,
  isTimeRangeOverlapping,
  timeToMinutes,
  validateBookingTime,
} = require("../src/utils/bookingTime");

test("timeToMinutes converts valid HH:mm time", () => {
  assert.equal(timeToMinutes("18:30"), 1110);
  assert.equal(timeToMinutes("23:59"), 1439);
});

test("timeToMinutes rejects invalid time", () => {
  assert.equal(timeToMinutes("24:00"), null);
  assert.equal(timeToMinutes("9:00"), null);
});

test("booking overlap rule rejects overlapping time", () => {
  assert.equal(
    isTimeRangeOverlapping({
      newStart: timeToMinutes("19:00"),
      newEnd: timeToMinutes("21:00"),
      existingStart: timeToMinutes("18:00"),
      existingEnd: timeToMinutes("20:00"),
    }),
    true
  );
});

test("booking overlap rule allows back-to-back bookings", () => {
  assert.equal(
    isTimeRangeOverlapping({
      newStart: timeToMinutes("20:00"),
      newEnd: timeToMinutes("21:00"),
      existingStart: timeToMinutes("18:00"),
      existingEnd: timeToMinutes("20:00"),
    }),
    false
  );
});

test("booking overlap rule ignores invalid stored time values", () => {
  assert.equal(
    isTimeRangeOverlapping({
      newStart: timeToMinutes("18:00"),
      newEnd: timeToMinutes("20:00"),
      existingStart: null,
      existingEnd: timeToMinutes("21:00"),
    }),
    false
  );
});

test("validateBookingTime enforces field opening hours", () => {
  const field = { openTime: "10:00", closeTime: "23:00" };
  const result = validateBookingTime(field, "18:00", "20:00");

  assert.deepEqual(result, {
    startMinutes: timeToMinutes("18:00"),
    endMinutes: timeToMinutes("20:00"),
  });
  assert.throws(
    () => validateBookingTime(field, "09:00", "10:00"),
    /Booking time must be within field open hours/
  );
});

test("calculateBookingHours returns duration in hours", () => {
  assert.equal(
    calculateBookingHours(timeToMinutes("18:00"), timeToMinutes("20:30")),
    2.5
  );
});
