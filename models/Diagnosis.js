const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    disease: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      required: true,
    },

    treatmentAdvice: {
      type: String,
      default: "",
    },

    referralRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Diagnosis", diagnosisSchema);