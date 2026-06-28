import api from "./axios.js";

export const getFields = async (params = {}) => {
  const response = await api.get("/fields", { params });
  return response.data.fields || response.data;
};

export const getFieldById = async (id) => {
  const response = await api.get(`/fields/${id}`);
  return response.data.field || response.data;
};
