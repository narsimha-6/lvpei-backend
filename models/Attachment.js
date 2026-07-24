const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    patientPhoto: {
      type: String,
      default: "",
    },

    leftEyePhoto: {
      type: String,
      default: "",
    },

    rightEyePhoto: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attachment", attachmentSchema);