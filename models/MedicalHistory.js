const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    diabetes: {
      type: Boolean,
      default: false,
    },

    hypertension: {
      type: Boolean,
      default: false,
    },

    cataractSurgery: {
      type: Boolean,
      default: false,
    },

    eyeInjury: {
      type: Boolean,
      default: false,
    },

    spectacles: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);