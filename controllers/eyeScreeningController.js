const EyeScreening = require("../models/EyeScreening");

// Create Eye Screening
const createEyeScreening = async (req, res) => {
  try {
    const eyeScreening = await EyeScreening.create(req.body);

    res.status(201).json({
      success: true,
      message: "Eye Screening Saved Successfully",
      eyeScreening,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= Get All Eye Screenings =================

const getEyeScreenings = async (req, res) => {
  try {

    const eyeScreenings = await EyeScreening.find()
      .populate("patientId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      eyeScreenings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get Eye Screening By Patient =================

const getEyeScreeningByPatient = async (req, res) => {
  try {

    const eyeScreening = await EyeScreening.findOne({
      patientId: req.params.patientId,
    }).populate("patientId");

    if (!eyeScreening) {
      return res.status(404).json({
        success: false,
        message: "Eye Screening not found",
      });
    }

    res.status(200).json({
      success: true,
      eyeScreening,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Update Eye Screening =================

const updateEyeScreening = async (req, res) => {
  try {

    const eyeScreening = await EyeScreening.findById(req.params.id);

    if (!eyeScreening) {
      return res.status(404).json({
        success: false,
        message: "Eye Screening not found",
      });
    }

    eyeScreening.leftEyeVision = req.body.leftEyeVision;
    eyeScreening.rightEyeVision = req.body.rightEyeVision;

    eyeScreening.leftEyeCataract = req.body.leftEyeCataract;
    eyeScreening.rightEyeCataract = req.body.rightEyeCataract;

    eyeScreening.leftEyeCornealOpacity = req.body.leftEyeCornealOpacity;
    eyeScreening.rightEyeCornealOpacity = req.body.rightEyeCornealOpacity;

    eyeScreening.leftEyeRedEye = req.body.leftEyeRedEye;
    eyeScreening.rightEyeRedEye = req.body.rightEyeRedEye;

    eyeScreening.complaint = req.body.complaint;
    eyeScreening.duration = req.body.duration;
    eyeScreening.notes = req.body.notes;

    await eyeScreening.save();

    res.status(200).json({
      success: true,
      message: "Eye Screening Updated Successfully",
      eyeScreening,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  createEyeScreening,
  getEyeScreenings,
  getEyeScreeningByPatient,
  updateEyeScreening,
};