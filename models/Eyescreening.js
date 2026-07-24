const mongoose = require("mongoose");

const eyeScreeningSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    leftEyeVision: {
      type: String,
      required: true,
    },

    rightEyeVision: {
      type: String,
      required: true,
    },

    leftEyeCataract: {
      type: Boolean,
      default: false,
    },

    rightEyeCataract: {
      type: Boolean,
      default: false,
    },

    leftEyeCornealOpacity: {
      type: Boolean,
      default: false,
    },

    rightEyeCornealOpacity: {
      type: Boolean,
      default: false,
    },

    leftEyeRedEye: {
      type: Boolean,
      default: false,
    },

    rightEyeRedEye: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },

    complaint: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EyeScreening", eyeScreeningSchema);