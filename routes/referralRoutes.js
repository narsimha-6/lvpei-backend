const express = require("express");

const router = express.Router();

const {
  createReferral,
  getIncomingReferrals,
  getMyReferrals,
  acceptReferral,
  rejectReferral,
  markPatientVisited,
  startTreatment,
  completeReferral,
  getReferralHistory,
  getReferralById,
} = require("../controllers/referralController");

const { protect } = require("../middleware/authMiddleware");

// Create Referral
router.post("/", protect, createReferral);

// My Referrals
router.get("/my", protect, getMyReferrals);

// Incoming Referrals
router.get("/incoming", protect, getIncomingReferrals);

// Accept Referral
router.put("/:id/accept", protect, acceptReferral);

// Reject Referral
router.put("/:id/reject", protect, rejectReferral);

// Patient Visited
router.put("/:id/visited", protect, markPatientVisited);

// Treatment Started
router.put("/:id/treatment", protect, startTreatment);

// Referral Completed
router.put("/:id/complete", protect, completeReferral);


router.get("/:id/history", protect, getReferralHistory);

// Get Referral By ID
router.get("/:id", protect, getReferralById);

module.exports = router;