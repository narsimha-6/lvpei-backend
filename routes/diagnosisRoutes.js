const express = require("express");

const router = express.Router();

const {
  createDiagnosis,
  getDiagnoses,
  getDiagnosisByPatient,
  updateDiagnosis,
} = require("../controllers/diagnosisController");

// Save Diagnosis
router.post("/", createDiagnosis);

// Get All Diagnoses
router.get("/", getDiagnoses);

// Get Diagnosis By Patient
router.get("/:patientId", getDiagnosisByPatient);

// Update Diagnosis
router.put("/:id", updateDiagnosis);

module.exports = router;