const express = require("express");

const router = express.Router();

const { createPatient,updatePatientLocation, getPatients, getPatientById, updatePatient, searchPatients, } = require("../controllers/patientController");

// Create Patient
router.post("/", createPatient);
    
// Update Patient Location
router.put("/location", updatePatientLocation);

router.get("/",getPatients);
router.get("/:id",getPatientById);
router.put("/:id",updatePatient);
router.get("/search",searchPatients);

module.exports = router;