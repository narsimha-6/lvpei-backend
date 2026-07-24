const express = require("express");

const {
  createVisionCenter,
  getVisionCenters,
  getVisionCenterById,
  updateVisionCenter,
  changeVisionCenterStatus,
} = require("../controllers/visionCenterController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Vision Center
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createVisionCenter
);

// Get All Vision Centers
router.get(
  "/",
  protect,
  getVisionCenters
);
// Get Vision Center By ID
router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  getVisionCenterById
);

// Update Vision Center
router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  updateVisionCenter
);

// Change Vision Center Status
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  changeVisionCenterStatus
);

module.exports = router;