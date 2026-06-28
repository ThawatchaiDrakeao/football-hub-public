import api from "./axios.js";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data.booking || response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my-bookings");
  return response.data.bookings || response.data;
};
