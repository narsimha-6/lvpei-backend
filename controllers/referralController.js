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
      referredCenterType,
      referredCenterId,
      referralReason,
      diagnosisSummary,
      remarks,
      priority,
    } = req.body;
    if (
      !patientId ||
      !referredCenterType ||
      !referredCenterId ||
      !referralReason
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
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
    if (referredCenterType === "VISION_CENTER") {
      console.log("Referral Center ID:", referredCenterId);

const center = await VisionCenter.findById(referredCenterId);

console.log("Vision Center Found:", center);

if (!center) {
  return res.status(404).json({
    success: false,
    message: "Vision Center not found",
  });
}

const admins = await User.find({
  role: "VISION_CENTER_ADMIN",
    });

    console.log("All Vision Center Admins:", admins);

    assignedAdmin = await User.findOne({
      role: "VISION_CENTER_ADMIN",
      visionCenter: referredCenterId,
      status: "ACTIVE",
    });

    console.log("Assigned Admin:", assignedAdmin);

      if (!assignedAdmin) {
        return res.status(404).json({
          success: false,
          message:
            "No Vision Center Admin assigned.",
        });
      }
    }
    if (
      referredCenterType ===
      "SECONDARY_CENTER"
    ) {
      const center =
        await SecondaryCenter.findById(
          referredCenterId
        );

      if (!center) {
        return res.status(404).json({
          success: false,
          message:
            "Secondary Center not found",
        });
      }

      assignedAdmin = await User.findOne({
        role: "SECONDARY_CENTER_ADMIN",
        secondaryCenter: referredCenterId,
        status: "ACTIVE",
      });

      if (!assignedAdmin) {
        return res.status(404).json({
          success: false,
          message:
            "No Secondary Center Admin assigned.",
        });
      }
    }
    const referral = await Referral.create({
      patientId,

      referredCenterType,

      referredCenterId,

      referralReason,

      diagnosisSummary,

      remarks,

      priority,

      referredBy: req.user._id,

      assignedTo: assignedAdmin._id,

      status: "PENDING",
    });

    const io = req.app.get("io");

    await createNotification({
    receiver: assignedAdmin._id,
    sender: req.user._id,
    title: "New Referral",
    message: "New referral created",
    referralId: referral._id,
    io,
});

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
