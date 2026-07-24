const Diagnosis = require("../models/Diagnosis");

// Create Diagnosis
const createDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.create(req.body);

    res.status(201).json({
      success: true,
      message: "Diagnosis Saved Successfully",
      diagnosis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= Get All Diagnoses =================

const getDiagnoses = async (req, res) => {
  try {

    const diagnoses = await Diagnosis.find()
      .populate("patientId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      diagnoses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get Diagnosis By Patient =================

const getDiagnosisByPatient = async (req, res) => {
  try {

    const diagnosis = await Diagnosis.findOne({
      patientId: req.params.patientId,
    }).populate("patientId");

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: "Diagnosis not found",
      });
    }

    res.status(200).json({
      success: true,
      diagnosis,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Update Diagnosis =================

const updateDiagnosis = async (req, res) => {
  try {

    const diagnosis = await Diagnosis.findById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: "Diagnosis not found",
      });
    }

    diagnosis.disease = req.body.disease;
    diagnosis.severity = req.body.severity;
    diagnosis.treatmentAdvice = req.body.treatmentAdvice;
    diagnosis.referralRequired = req.body.referralRequired;

    await diagnosis.save();

    res.status(200).json({
      success: true,
      message: "Diagnosis Updated Successfully",
      diagnosis,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  createDiagnosis,
  getDiagnoses,
  getDiagnosisByPatient,
  updateDiagnosis,
};