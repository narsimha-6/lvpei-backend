const mongoose = require("mongoose");

const visionCenterSchema = new mongoose.Schema(
  {
    centerCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    centerName: {
      type: String,
      required: true,
      trim: true,
    },

    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VisionCenter", visionCenterSchema);