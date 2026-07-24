const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
  type: String,
  enum: [
    "ADMIN",
    "SECONDARY_CENTER_ADMIN",
    "VISION_CENTER_ADMIN",
    "FIELD_WORKER",
  ],
  required: true,
},

    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      default: null,
    },

    visionCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisionCenter",
      default: null,
    },

    secondaryCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SecondaryCenter",
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);