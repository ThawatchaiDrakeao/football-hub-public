const express = require("express");
const {
  cancelMyBooking,
  createBooking,
  getBookingById,
  getBookings,
  getMyBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { admin } = require("../middlewares/adminMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createBooking).get(protect, admin, getBookings);
router.get("/my-bookings", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/cancel", protect, cancelMyBooking);
router.patch("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;
