import api from "./axios.js";

export const getCommunityPosts = async (params = {}) => {
  const response = await api.get("/community-posts", { params });
  return response.data.posts || response.data.communityPosts || response.data;
};

export const getCommunityPostById = async (id) => {
  const response = await api.get(`/community-posts/${id}`);
  return response.data.post || response.data.communityPost || response.data;
};

export const createCommunityPost = async (payload) => {
  const response = await api.post("/community-posts", payload);
  return response.data.post || response.data.communityPost || response.data;
};

export const joinCommunityPost = async (id, message = "") => {
  const response = await api.post(`/community-posts/${id}/join`, { message });
  return response.data.joinRequest || response.data;
};

export const getMyCommunityPosts = async () => {
  const response = await api.get("/community-posts/my-posts");
  return response.data.posts || response.data.communityPosts || response.data;
};

export const getJoinRequests = async (postId) => {
  const response = await api.get(`/community-posts/${postId}/join-requests`);
  return response.data.joinRequests || response.data.requests || response.data;
};

export const acceptJoinRequest = async (requestId) => {
  const response = await api.patch(`/join-requests/${requestId}/accept`);
  return response.data.joinRequest || response.data;
};

export const rejectJoinRequest = async (requestId) => {
  const response = await api.patch(`/join-requests/${requestId}/reject`);
  return response.data.joinRequest || response.data;
};
