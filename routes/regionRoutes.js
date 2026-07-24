const express = require("express");

const router = express.Router();

const {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  changeRegionStatus,
  deleteRegion,
} = require("../controllers/regionController");

// Create Region
router.post("/", createRegion);

// Get All Regions
router.get("/", getRegions);

// Get Region By ID
router.get("/:id", getRegionById);

// Update Region
router.put("/:id", updateRegion);

// Activate / Deactivate Region
router.patch("/:id/status", changeRegionStatus);

// Delete Region
router.delete("/:id", deleteRegion);

module.exports = router;