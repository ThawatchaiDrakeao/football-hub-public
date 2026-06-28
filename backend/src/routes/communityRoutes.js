const express = require("express");
const {
  acceptJoinRequest,
  createCommunityPost,
  deleteCommunityPost,
  getCommunityPostById,
  getCommunityPosts,
  getJoinRequestsForPost,
  getMyCommunityPosts,
  joinCommunityPost,
  rejectJoinRequest,
  updateCommunityPost,
} = require("../controllers/communityController");
const { protect } = require("../middlewares/authMiddleware");

const communityPostRouter = express.Router();
const joinRequestRouter = express.Router();

communityPostRouter
  .route("/")
  .get(getCommunityPosts)
  .post(protect, createCommunityPost);

communityPostRouter.get("/my-posts", protect, getMyCommunityPosts);
communityPostRouter.get("/:id", getCommunityPostById);
communityPostRouter.patch("/:id", protect, updateCommunityPost);
communityPostRouter.delete("/:id", protect, deleteCommunityPost);
communityPostRouter.post("/:id/join", protect, joinCommunityPost);
communityPostRouter.get(
  "/:id/join-requests",
  protect,
  getJoinRequestsForPost
);

joinRequestRouter.patch("/:id/accept", protect, acceptJoinRequest);
joinRequestRouter.patch("/:id/reject", protect, rejectJoinRequest);

module.exports = {
  communityPostRouter,
  joinRequestRouter,
};
