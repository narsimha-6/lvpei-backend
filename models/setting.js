const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      default: "LVPEI",
    },

    organizationName: {
      type: String,
      default: "L V Prasad Eye Institute",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    autoBackup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);