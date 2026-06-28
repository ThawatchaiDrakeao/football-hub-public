const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const timeToMinutes = (time) => {
  if (!timePattern.test(time)) {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isTimeRangeOverlapping = ({
  newStart,
  newEnd,
  existingStart,
  existingEnd,
}) => {
  if (
    [newStart, newEnd, existingStart, existingEnd].some(
      (value) => typeof value !== "number"
    )
  ) {
    return false;
  }

  return newStart < existingEnd && newEnd > existingStart;
};

const validateBookingTime = (field, startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const openMinutes = timeToMinutes(field.openTime);
  const closeMinutes = timeToMinutes(field.closeTime);

  if (
    startMinutes === null ||
    endMinutes === null ||
    openMinutes === null ||
    closeMinutes === null
  ) {
    throw createHttpError("Time must use HH:mm format", 400);
  }

  if (startMinutes >= endMinutes) {
    throw createHttpError("Start time must be before end time", 400);
  }

  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    throw createHttpError("Booking time must be within field open hours", 400);
  }

  return { startMinutes, endMinutes };
};

const calculateBookingHours = (startMinutes, endMinutes) => {
  return (endMinutes - startMinutes) / 60;
};

module.exports = {
  calculateBookingHours,
  isTimeRangeOverlapping,
  timeToMinutes,
  validateBookingTime,
};
