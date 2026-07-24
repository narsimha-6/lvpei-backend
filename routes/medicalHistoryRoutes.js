const express = require("express");

const router = express.Router();

const {
  createMedicalHistory,
  getMedicalHistories,
  getMedicalHistoryByPatient,
  updateMedicalHistory,
} = require("../controllers/medicalHistoryController");

// Save Medical History
router.post("/", createMedicalHistory);

// Get All Medical Histories
router.get("/", getMedicalHistories);

// Get Medical History By Patient
router.get("/:patientId", getMedicalHistoryByPatient);

// Update Medical History
router.put("/:id", updateMedicalHistory);

module.exports = router;