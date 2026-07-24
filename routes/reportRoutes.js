const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getPatientsPerDay,
  getRecentActivity,
  getReportByDate,
  getPatientReport,
} = require("../controllers/reportController");

router.get("/dashboard", getDashboardStats);

router.get("/patients-per-day", getPatientsPerDay);

router.get("/recent-activity", getRecentActivity);

router.get("/date/:date", getReportByDate);

router.get("/patients",getPatientReport);

module.exports = router;