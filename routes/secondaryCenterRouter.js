const express = require("express");

const router = express.Router();

const {
  createSecondaryCenter,
  getSecondaryCenters,
  updateSecondaryCenter,
} = require("../controllers/secondaryCenterController");

router.post("/", createSecondaryCenter);

router.get("/", getSecondaryCenters);

router.put("/:id",updateSecondaryCenter);

module.exports = router;