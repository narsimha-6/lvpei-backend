const express = require("express");

const router = express.Router();

const {
  createAdmin,
  createSecondaryCenterAdmin,
  getSecondaryCenterAdmins,
  getSecondaryCenterAdminById,
  updateSecondaryCenterAdmin,
  changeSecondaryCenterAdminStatus,
  createVisionCenterAdmin,
   getVisionCenterAdmins,
  getVisionCenterAdminById,
  updateVisionCenterAdmin,
  changeVisionCenterAdminStatus,
  createFieldWorker,
  getFieldWorkers,
  getFieldWorkerById,
  updateFieldWorker,
  changeFieldWorkerStatus,

  loginUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/login", loginUser);
router.post(
  "/secondary-center-admin",
  protect,
  authorize("ADMIN"),
  createSecondaryCenterAdmin
);
router.get(
  "/secondary-center-admin",
  protect,
  authorize("ADMIN"),
  getSecondaryCenterAdmins
);

router.get(
  "/secondary-center-admin/:id",
  protect,
  authorize("ADMIN"),
  getSecondaryCenterAdminById
);
// Update Secondary Center Admin
router.put(
  "/secondary-center-admin/:id",
  protect,
  authorize("ADMIN"),
  updateSecondaryCenterAdmin
);

// Activate / Deactivate
router.patch(
  "/secondary-center-admin/:id/status",
  protect,
  authorize("ADMIN"),
  changeSecondaryCenterAdminStatus
);

router.post(
  "/field-worker",
  protect,
  authorize("ADMIN", "SECONDARY_CENTER_ADMIN"),
  createFieldWorker
);

router.get(
  "/field-worker",
  protect,
  authorize("ADMIN", "SECONDARY_CENTER_ADMIN"),
  getFieldWorkers
);
router.get(
  "/field-worker/:id",
  protect,
  authorize("ADMIN", "SECONDARY_CENTER_ADMIN"),
  getFieldWorkerById
);

router.put(
  "/field-worker/:id",
  protect,
  authorize("ADMIN", "SECONDARY_CENTER_ADMIN"),
  updateFieldWorker
);

router.patch(
  "/field-worker/:id/status",
  protect,
  authorize("ADMIN", "SECONDARY_CENTER_ADMIN"),
  changeFieldWorkerStatus
);
router.post(
  "/vision-center-admin",
  protect,
  authorize("ADMIN"),
  createVisionCenterAdmin
);
router.get(
  "/vision-center-admin",
  protect,
  authorize("ADMIN"),
  getVisionCenterAdmins
);
router.get(
  "/vision-center-admin/:id",
  protect,
  authorize("ADMIN"),
  getVisionCenterAdminById
);

router.put(
  "/vision-center-admin/:id",
  protect,
  authorize("ADMIN"),
  updateVisionCenterAdmin
);

router.patch(
  "/vision-center-admin/:id/status",
  protect,
  authorize("ADMIN"),
  changeVisionCenterAdminStatus
);
router.post("/admin",createAdmin);

module.exports = router;