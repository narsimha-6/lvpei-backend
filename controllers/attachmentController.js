const Attachment = require("../models/Attachment");

// Create Attachment
const createAttachment = async (req, res) => {
  try {
    const {
      patientId,
      patient_id,
      patient,
      _patientId,
      patientPhoto,
      leftEyePhoto,
      rightEyePhoto,
      ...rest
    } = req.body || {};

    const resolvedPatientId =
      patientId ||
      patient_id ||
      patient?.id ||
      patient?._id ||
      _patientId ||
      null;

    if (!resolvedPatientId) {
      return res.status(400).json({
        success: false,
        message: "patientId is required",
      });
    }

    const attachment = await Attachment.create({
      patientId: resolvedPatientId,
      patientPhoto: patientPhoto || "",
      leftEyePhoto: leftEyePhoto || "",
      rightEyePhoto: rightEyePhoto || "",
      ...rest,
    });

    res.status(201).json({
      success: true,
      message: "Attachments Saved Successfully",
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
  createAttachment,
};