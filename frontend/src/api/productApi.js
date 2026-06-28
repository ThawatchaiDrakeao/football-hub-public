import api from "./axios.js";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data.products || response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.product || response.data;
};
