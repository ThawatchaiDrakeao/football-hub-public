const Booking = require("../models/Booking");
const Field = require("../models/Field");
const {
  calculateBookingHours,
  isTimeRangeOverlapping,
  timeToMinutes,
  validateBookingTime,
} = require("../utils/bookingTime");

const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

const checkBookingConflict = async ({
  fieldId,
  date,
  startMinutes,
  endMinutes,
}) => {
  const activeBookings = await Booking.find({
    field: fieldId,
    date,
    status: { $in: ["pending", "confirmed"] },
  });

  const hasConflict = activeBookings.some((booking) => {
    const existingStart = timeToMinutes(booking.startTime);
    const existingEnd = timeToMinutes(booking.endTime);

    // Overlap rule: newStart < existingEnd AND newEnd > existingStart.
    return isTimeRangeOverlapping({
      newStart: startMinutes,
      newEnd: endMinutes,
      existingStart,
      existingEnd,
    });
  });

  if (hasConflict) {
    const error = new Error("This field is already booked for the selected time");
    error.statusCode = 409;
    throw error;
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { field: fieldId, date, startTime, endTime } = req.body;

    if (!fieldId || !date || !startTime || !endTime) {
      res.status(400);
      throw new Error("Field, date, startTime, and endTime are required");
    }

    const field = await Field.findOne({ _id: fieldId, isActive: true });

    if (!field) {
      res.status(404);
      throw new Error("Field not found");
    }

    const { startMinutes, endMinutes } = validateBookingTime(
      field,
      startTime,
      endTime
    );

    await checkBookingConflict({
      fieldId: field._id,
      date,
      startMinutes,
      endMinutes,
    });

    // Calculate price on the backend so users cannot change booking cost.
    const durationHours = calculateBookingHours(startMinutes, endMinutes);
    const totalPrice = field.pricePerHour * durationHours;

    const booking = await Booking.create({
      user: req.user._id,
      field: field._id,
      date,
      startTime,
      endTime,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }

    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("field", "name location fieldType pricePerHour")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email role")
      .populate("field", "name location fieldType pricePerHour");

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not allowed to view this booking");
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not allowed to cancel this booking");
    }

    if (["cancelled", "completed"].includes(booking.status)) {
      res.status(400);
      throw new Error("This booking cannot be cancelled");
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("field", "name location fieldType pricePerHour")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error("Invalid booking status");
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  cancelMyBooking,
  createBooking,
  getBookingById,
  getBookings,
  getMyBookings,
  updateBookingStatus,
};
