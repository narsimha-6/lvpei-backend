const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    mandal: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },
    latitude: {
  type: Number,
  default: null,
},

longitude: {
  type: Number,
  default: null,
},
gpsVillage: {
  type: String,
  default: "",
},

gpsMandal: {
  type: String,
  default: "",
},

gpsDistrict: {
  type: String,
  default: "",
},

gpsState: {
  type: String,
  default: "",
},

gpsPincode: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);