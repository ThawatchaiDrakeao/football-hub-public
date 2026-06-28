const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Field name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Field location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Field description is required"],
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, "Field price per hour is required"],
      min: [0, "Field price per hour cannot be negative"],
    },
    fieldType: {
      type: String,
      enum: ["5-a-side", "7-a-side", "11-a-side"],
    },
    images: {
      type: [String],
      default: [],
    },
    openTime: {
      type: String,
      required: [true, "Open time is required"],
      trim: true,
    },
    closeTime: {
      type: String,
      required: [true, "Close time is required"],
      trim: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Field", fieldSchema);
