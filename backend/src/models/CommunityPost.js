const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Match location is required"],
      trim: true,
    },
    matchDate: {
      type: String,
      required: [true, "Match date is required"],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },
    playersNeeded: {
      type: Number,
      required: [true, "Players needed is required"],
      min: [1, "Players needed must be at least 1"],
    },
    currentPlayers: {
      type: Number,
      default: 1,
      min: [1, "Current players must be at least 1"],
    },
    skillLevel: {
      type: String,
      enum: ["beginner", "casual", "intermediate", "competitive"],
      required: [true, "Skill level is required"],
    },
    status: {
      type: String,
      enum: ["open", "full", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
