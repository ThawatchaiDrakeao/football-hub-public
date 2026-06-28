import api from "./axios.js";

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data.order || response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data.orders || response.data;
};
