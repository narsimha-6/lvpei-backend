const Patient = require("../models/Patient");

// Create Patient
const createPatient = async (req, res) => {
  try {

    const existingPatient = await Patient.findOne({
      mobile: req.body.mobile,
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient with this mobile number already exists",
      });
    }

    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: "Patient Registered Successfully",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const updatePatientLocation = async (req, res) => {
  try {

    const {
      patientId,
      latitude,
      longitude,
      gpsVillage,
      gpsMandal,
      gpsDistrict,
      gpsState,
      gpsPincode,
    } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        latitude,
        longitude,
        gpsVillage,
        gpsMandal,
        gpsDistrict,
        gpsState,
        gpsPincode,
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "GPS Location Saved Successfully",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get All Patients =================

const getPatients = async (req, res) => {
  try {

    const patients = await Patient.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      patients,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get Patient By ID =================

const getPatientById = async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Update Patient =================

const updatePatient = async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.patientName = req.body.patientName;
    patient.age = req.body.age;
    patient.gender = req.body.gender;
    patient.mobile = req.body.mobile;
    patient.village = req.body.village;
    patient.mandal = req.body.mandal;
    patient.district = req.body.district;

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient Updated Successfully",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Search Patients =================

const searchPatients = async (req, res) => {
  try {

    const keyword = req.query.keyword || "";

    const patients = await Patient.find({
      $or: [
        {
          patientName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          village: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      patients,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  updatePatientLocation,
  searchPatients,
};