const express = require("express");

const router = express.Router();

const {
  getVisionCenterAdmins,
  getVisionCenterAdminById,
  createVisionCenterAdmin,
  updateVisionCenterAdmin,
  changeVisionCenterAdminStatus,
} = require("../controllers/visionCenterAdminController");

// Get all Vision Center Admins
router.get("/", getVisionCenterAdmins);

// Get single Vision Center Admin
router.get("/:id", getVisionCenterAdminById);

// Create Vision Center Admin
router.post("/", createVisionCenterAdmin);

// Update Vision Center Admin
router.put("/:id", updateVisionCenterAdmin);

// Activate / Deactivate Vision Center Admin
router.patch("/:id/status", changeVisionCenterAdminStatus);

module.exports = router;