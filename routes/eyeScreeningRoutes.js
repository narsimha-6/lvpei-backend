const express = require("express");

const router = express.Router();

const {
  createEyeScreening,
   getEyeScreenings,
  getEyeScreeningByPatient,
  updateEyeScreening,
} = require("../controllers/eyeScreeningController");

// Save Eye Screening
router.post("/", createEyeScreening);

// Get All Eye Screenings
router.get("/", getEyeScreenings);

// Get Eye Screening By Patient
router.get("/:patientId", getEyeScreeningByPatient);

// Update Eye Screening
router.put("/:id", updateEyeScreening);

module.exports = router;