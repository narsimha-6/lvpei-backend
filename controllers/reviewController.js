const Patient = require("../models/Patient");
const MedicalHistory = require("../models/MedicalHistory");
const EyeScreening = require("../models/EyeScreening");
const Diagnosis = require("../models/Diagnosis");
const Referral = require("../models/Referral");
const Attachment = require("../models/Attachment");

const getReview = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId);
    const medicalHistory = await MedicalHistory.findOne({ patientId });
    const eyeScreening = await EyeScreening.findOne({ patientId });
    const diagnosis = await Diagnosis.findOne({ patientId });
    const referral = await Referral.findOne({ patientId });
    const attachment = await Attachment.findOne({ patientId });

    res.status(200).json({
      success: true,
      patient,
      medicalHistory,
      eyeScreening,
      diagnosis,
      referral,
      attachment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getReview,
};