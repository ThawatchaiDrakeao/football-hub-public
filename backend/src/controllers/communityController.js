const CommunityPost = require("../models/CommunityPost");
const JoinRequest = require("../models/JoinRequest");

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isPostOwnerOrAdmin = (post, user) => {
  return post.user.toString() === user._id.toString() || user.role === "admin";
};

const getCommunityPosts = async (req, res, next) => {
  try {
    const { skillLevel, status, search } = req.query;
    const filter = {};

    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { location: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const posts = await CommunityPost.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getCommunityPostById = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!post) {
      res.status(404);
      throw new Error("Community post not found");
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const createCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.create({
      ...req.body,
      user: req.user._id,
      currentPlayers: 1,
      status: "open",
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const updateCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Community post not found");
    }

    if (!isPostOwnerOrAdmin(post, req.user)) {
      res.status(403);
      throw new Error("Not allowed to update this community post");
    }

    const protectedFields = ["user", "currentPlayers"];
    protectedFields.forEach((field) => delete req.body[field]);

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const deleteCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Community post not found");
    }

    if (!isPostOwnerOrAdmin(post, req.user)) {
      res.status(403);
      throw new Error("Not allowed to delete this community post");
    }

    post.status = "closed";
    await post.save();

    res.status(200).json({
      message: "Community post closed successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCommunityPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const joinCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Community post not found");
    }

    if (post.user.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot join your own community post");
    }

    if (["full", "closed"].includes(post.status)) {
      res.status(400);
      throw new Error("This community post is not open for join requests");
    }

    const existingRequest = await JoinRequest.findOne({
      post: post._id,
      user: req.user._id,
    });

    if (existingRequest) {
      res.status(409);
      throw new Error("You already sent a join request for this post");
    }

    const joinRequest = await JoinRequest.create({
      post: post._id,
      user: req.user._id,
      message: req.body.message,
    });

    res.status(201).json(joinRequest);
  } catch (error) {
    next(error);
  }
};

const getJoinRequestsForPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Community post not found");
    }

    if (!isPostOwnerOrAdmin(post, req.user)) {
      res.status(403);
      throw new Error("Not allowed to view join requests for this post");
    }

    const joinRequests = await JoinRequest.find({ post: post._id })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(joinRequests);
  } catch (error) {
    next(error);
  }
};

const acceptJoinRequest = async (req, res, next) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id).populate(
      "post"
    );

    if (!joinRequest) {
      res.status(404);
      throw new Error("Join request not found");
    }

    const post = joinRequest.post;

    if (!isPostOwnerOrAdmin(post, req.user)) {
      res.status(403);
      throw new Error("Not allowed to accept this join request");
    }

    if (joinRequest.status !== "pending") {
      res.status(400);
      throw new Error("Only pending join requests can be accepted");
    }

    if (post.status !== "open") {
      res.status(400);
      throw new Error("This community post is not open");
    }

    joinRequest.status = "accepted";
    post.currentPlayers += 1;

    // Mark the post as full as soon as the requested player count is reached.
    if (post.currentPlayers >= post.playersNeeded) {
      post.status = "full";
    }

    await post.save();
    await joinRequest.save();

    res.status(200).json(joinRequest);
  } catch (error) {
    next(error);
  }
};

const rejectJoinRequest = async (req, res, next) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.id).populate(
      "post"
    );

    if (!joinRequest) {
      res.status(404);
      throw new Error("Join request not found");
    }

    const post = joinRequest.post;

    if (!isPostOwnerOrAdmin(post, req.user)) {
      res.status(403);
      throw new Error("Not allowed to reject this join request");
    }

    if (joinRequest.status !== "pending") {
      res.status(400);
      throw new Error("Only pending join requests can be rejected");
    }

    joinRequest.status = "rejected";
    await joinRequest.save();

    res.status(200).json(joinRequest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
