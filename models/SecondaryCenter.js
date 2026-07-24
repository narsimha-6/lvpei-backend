const mongoose = require("mongoose");

const secondaryCenterSchema = new mongoose.Schema(
  {
    centerName: {
      type: String,
      required: true,
      trim: true,
    },

    centerCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
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

module.exports = mongoose.model(
  "SecondaryCenter",
  secondaryCenterSchema
);