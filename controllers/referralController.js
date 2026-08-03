const Referral = require("../models/Referral");
const Notification = require("../models/Notification");
const ReferralHistory = require("../models/ReferralHistory");

const User = require("../models/User");
const Patient = require("../models/Patient");
const VisionCenter = require("../models/VisionCenter");
const SecondaryCenter = require("../models/SecondaryCenter");

const createNotification = async ({
  receiver,
  sender,
  title,
  message,
  referralId,
}) => {
  return await Notification.create({
    receiver,
    sender,
    title,
    message,
    referralId,
  });
};

const createHistory = async ({
  referralId,
  action,
  performedBy,
  remarks = "",
}) => {
  return await ReferralHistory.create({
    referralId,
    action,
    performedBy,
    remarks,
  });
};
const createReferral = async (req, res) => {
  try {
    const {
      patientId,
      referralRequired,
      referralCenter,
      referredCenterType: requestedCenterType,
      referredCenterId: requestedCenterId,
      referralReason: incomingReferralReason,
      diagnosisSummary,
      remarks: incomingRemarks,
      priority: incomingPriority,
      followUpDate: incomingFollowUpDate,
      notification,
      reason,
      centerId,
      centerType,
    } = req.body;

    const shouldRequireReferral = referralRequired !== false;
    const resolvedCenterId =
      requestedCenterId ||
      referralCenter?.id ||
      referralCenter?._id ||
      referralCenter?.centerId ||
      referralCenter ||
      notification?.centerId ||
      centerId ||
      null;

    const resolvedCenterType =
      requestedCenterType ||
      referralCenter?.type ||
      referralCenter?.centerType ||
      centerType ||
      "VISION_CENTER";

    const normalizedPriority = incomingPriority || notification?.priority || "NORMAL";
    const normalizedFollowUpDate = incomingFollowUpDate || notification?.followUpDate || null;
    const normalizedRemarks = incomingRemarks || notification?.remarks || remarks || "";
    const normalizedReferralReason =
      incomingReferralReason ||
      reason ||
      (normalizedRemarks ? "Referral requested" : "Referral requested by user");

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    if (shouldRequireReferral && !resolvedCenterId) {
      return res.status(400).json({
        success: false,
        message: "Referral center is required",
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    let assignedAdmin = null;
    if (resolvedCenterId) {
      if (resolvedCenterType === "VISION_CENTER") {
        const center = await VisionCenter.findById(resolvedCenterId);

        if (!center) {
          return res.status(404).json({
            success: false,
            message: "Vision Center not found",
          });
        }

        assignedAdmin = await User.findOne({
          role: "VISION_CENTER_ADMIN",
          visionCenter: resolvedCenterId,
          status: "ACTIVE",
        });

        if (!assignedAdmin && shouldRequireReferral) {
          return res.status(404).json({
            success: false,
            message: "No Vision Center Admin assigned.",
          });
        }
      }

      if (resolvedCenterType === "SECONDARY_CENTER") {
        const center = await SecondaryCenter.findById(resolvedCenterId);

        if (!center) {
          return res.status(404).json({
            success: false,
            message: "Secondary Center not found",
          });
        }

        assignedAdmin = await User.findOne({
          role: "SECONDARY_CENTER_ADMIN",
          secondaryCenter: resolvedCenterId,
          status: "ACTIVE",
        });

        if (!assignedAdmin && shouldRequireReferral) {
          return res.status(404).json({
            success: false,
            message: "No Secondary Center Admin assigned.",
          });
        }
      }
    }

    const referral = await Referral.create({
      patientId,
      referredCenterType: resolvedCenterType,
      referredCenterId: resolvedCenterId,
      referralReason: normalizedReferralReason,
      diagnosisSummary,
      remarks: normalizedRemarks,
      priority: normalizedPriority,
      followUpDate: normalizedFollowUpDate,
      referredBy: req.user._id,
      assignedTo: assignedAdmin ? assignedAdmin._id : null,
      status: "PENDING",
    });

    if (assignedAdmin) {
      const io = req.app.get("io");
      const notificationTitle = notification?.title || "New Referral";
      const notificationBody =
        notification?.body ||
        notification?.message ||
        "New referral created";
      const followUpText = normalizedFollowUpDate
        ? ` Follow-up date: ${new Date(normalizedFollowUpDate).toLocaleDateString("en-IN")}.`
        : "";

      await createNotification({
        receiver: assignedAdmin._id,
        sender: req.user._id,
        title: notificationTitle,
        message: `${notificationBody}${followUpText}`,
        referralId: referral._id,
        io,
      });
    }

    await createHistory({
      referralId: referral._id,

      action: "REFERRAL_CREATED",

      performedBy: req.user._id,

      remarks: referralReason,
    });
    const createdReferral =
      await Referral.findById(referral._id)
        .populate(
          "patientId",
          "patientName mobile village mandal district"
        )
        .populate(
          "referredBy",
          "name employeeCode role"
        )
        .populate(
          "assignedTo",
          "name employeeCode role"
        );

    return res.status(201).json({
      success: true,
      message:
        "Referral created successfully.",
      referral: createdReferral,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getIncomingReferrals = async (
  req,
  res
) => {
  try {
    const referrals =
      await Referral.find({
        assignedTo: req.user._id,
      })
        .populate(
          "patientId",
          "patientName mobile village mandal district"
        )
        .populate(
          "referredBy",
          "name employeeCode role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({
      referredBy: req.user._id,
    })
      .populate(
        "patientId",
        "patientName mobile village mandal district"
      )
      .populate(
        "assignedTo",
        "name employeeCode role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



const acceptReferral = async (req, res) => {
  try {

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    if (
      referral.assignedTo.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    referral.status = "ACCEPTED";

    referral.acceptedDate = new Date();

    await referral.save();

    await createHistory({
      referralId: referral._id,
      action: "REFERRAL_ACCEPTED",
      performedBy: req.user._id,
      remarks: "Referral Accepted",
    });

    await createNotification({
      receiver: referral.referredBy,
      sender: req.user._id,
      title: "Referral Accepted",
      message:
        "Your referral has been accepted by the destination center.",
      referralId: referral._id,
    });

    const updatedReferral = await Referral.findById(
      referral._id
    )
      .populate(
        "patientId",
        "patientName mobile village"
      )
      .populate(
        "assignedTo",
        "name employeeCode"
      )
      .populate(
        "referredBy",
        "name employeeCode"
      );

    return res.status(200).json({
      success: true,
      message: "Referral Accepted",
      referral: updatedReferral,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const rejectReferral = async (req, res) => {
  try {

    const { remarks } = req.body;

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    if (
      referral.assignedTo.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    referral.status = "REJECTED";

    await referral.save();

    // Timeline

    await createHistory({
      referralId: referral._id,
      action: "REFERRAL_REJECTED",
      performedBy: req.user._id,
      remarks: remarks || "",
    });

    // Notification

    await createNotification({
      receiver: referral.referredBy,
      sender: req.user._id,
      title: "Referral Rejected",
      message:
        "Your referral has been rejected.",
      referralId: referral._id,
    });

    return res.status(200).json({
      success: true,
      message: "Referral Rejected Successfully",
      referral,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const markPatientVisited = async (req, res) => {
  try {

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    if (
      referral.assignedTo.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    referral.status = "PATIENT_VISITED";

    await referral.save();

   
    await createHistory({
      referralId: referral._id,
      action: "PATIENT_VISITED",
      performedBy: req.user._id,
      remarks: "Patient visited the center",
    });

    
    await createNotification({
      receiver: referral.referredBy,
      sender: req.user._id,
      title: "Patient Visited",
      message:
        "Patient has visited the destination center.",
      referralId: referral._id,
    });

    return res.status(200).json({
      success: true,
      message: "Patient Visit Updated",
      referral,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const startTreatment = async (req, res) => {
  try {

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    if (
      referral.assignedTo.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    referral.status = "UNDER_TREATMENT";

    await referral.save();

   
    await createHistory({
      referralId: referral._id,
      action: "TREATMENT_STARTED",
      performedBy: req.user._id,
      remarks: "Treatment Started",
    });

    
    await createNotification({
      receiver: referral.referredBy,
      sender: req.user._id,
      title: "Treatment Started",
      message:
        "Treatment has started for the referred patient.",
      referralId: referral._id,
    });

    return res.status(200).json({
      success: true,
      message: "Treatment Started",
      referral,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const completeReferral = async (req, res) => {
  try {

    const { remarks } = req.body;

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    if (
      referral.assignedTo.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    referral.status = "COMPLETED";

    referral.completedDate = new Date();

    if (remarks) {
      referral.remarks = remarks;
    }

    await referral.save();

    // Timeline
    await createHistory({
      referralId: referral._id,
      action: "REFERRAL_COMPLETED",
      performedBy: req.user._id,
      remarks: remarks || "Treatment Completed",
    });

    // Notification
    await createNotification({
      receiver: referral.referredBy,
      sender: req.user._id,
      title: "Treatment Completed",
      message:
        "Treatment has been completed successfully.",
      referralId: referral._id,
    });

    const updatedReferral = await Referral.findById(
      referral._id
    )
      .populate(
        "patientId",
        "patientName mobile village mandal district"
      )
      .populate(
        "assignedTo",
        "name employeeCode"
      )
      .populate(
        "referredBy",
        "name employeeCode"
      );

    return res.status(200).json({
      success: true,
      message: "Referral Completed Successfully",
      referral: updatedReferral,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("patientId", "patientName mobile village mandal district")
      .populate("referredBy", "name employeeCode role")
      .populate("assignedTo", "name employeeCode role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReferralHistory = async (req, res) => {
  try {

    const history = await ReferralHistory.find({
      referralId: req.params.id,
    })
      .populate(
        "performedBy",
        "name employeeCode role"
      )
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate("patientId")
      .populate("referredBy", "name employeeCode")
      .populate("assignedTo", "name employeeCode");

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    res.status(200).json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  createReferral,

  getAllReferrals,

  getIncomingReferrals,

  getMyReferrals,

  acceptReferral,

  rejectReferral,

  markPatientVisited,

  startTreatment,

  completeReferral,

  getReferralHistory,

  getReferralById,

};
