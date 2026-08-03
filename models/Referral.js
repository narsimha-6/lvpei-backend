const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    // Patient
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Referral Destination
    referredCenterType: {
      type: String,
      enum: [
        "VISION_CENTER",
        "SECONDARY_CENTER",
      ],
      default: "VISION_CENTER",
    },

    referredCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Referral Information
    referralReason: {
      type: String,
      required: true,
    },

    diagnosisSummary: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "NORMAL",
        "HIGH",
        "EMERGENCY",
      ],
      default: "NORMAL",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    // Workflow Status
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "PATIENT_VISITED",
        "UNDER_TREATMENT",
        "COMPLETED",
        "REJECTED",
      ],
      default: "PENDING",
    },

    // Audit
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    referredDate: {
      type: Date,
      default: Date.now,
    },

    acceptedDate: Date,

    completedDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Referral",
  referralSchema
);