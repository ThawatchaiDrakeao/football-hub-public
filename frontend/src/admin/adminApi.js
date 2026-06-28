import api from "../api/axios.js";

export const getProductsAdmin = async () => {
  const response = await api.get("/products");
  return response.data.products || response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data.product || response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post("/products", payload);
  return response.data.product || response.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await api.patch(`/products/${productId}`, payload);
  return response.data.product || response.data;
};

export const getOrdersAdmin = async () => {
  const response = await api.get("/orders");
  return response.data.orders || response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data.order || response.data;
};

export const getFieldsAdmin = async () => {
  const response = await api.get("/fields");
  return response.data.fields || response.data;
};

export const deleteField = async (fieldId) => {
  const response = await api.delete(`/fields/${fieldId}`);
  return response.data.field || response.data;
};

export const createField = async (payload) => {
  const response = await api.post("/fields", payload);
  return response.data.field || response.data;
};

export const updateField = async (fieldId, payload) => {
  const response = await api.patch(`/fields/${fieldId}`, payload);
  return response.data.field || response.data;
};

export const getBookingsAdmin = async () => {
  const response = await api.get("/bookings");
  return response.data.bookings || response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data.booking || response.data;
};

export const getCommunityPostsAdmin = async () => {
  const response = await api.get("/community-posts");
  return response.data.posts || response.data.communityPosts || response.data;
};

export const closeCommunityPost = async (postId) => {
  const response = await api.delete(`/community-posts/${postId}`);
  return response.data.post || response.data.communityPost || response.data;
};
