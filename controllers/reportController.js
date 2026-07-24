const Patient = require("../models/Patient");
const Referral = require("../models/Referral");
const Region = require("../models/Region");
const VisionCenter = require("../models/VisionCenter");
const User = require("../models/User");

// ================= Dashboard Statistics (Today's Data Only) =================

// ================= Dashboard Statistics =================

const getDashboardStats = async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalRegions,
      totalVisionCenters,
      totalSecondaryAdmins,
      totalFieldWorkers,
      todayPatients,
      todayReferrals,
      villages,
    ] = await Promise.all([

      Region.countDocuments(),

      VisionCenter.countDocuments(),

      User.countDocuments({
        role: "SECONDARY_CENTER_ADMIN",
      }),

      User.countDocuments({
        role: "FIELD_WORKER",
      }),

      Patient.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      }),

      Referral.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      }),

      Patient.distinct("village", {
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      }),

    ]);

    res.status(200).json({
      success: true,
      totalRegions,
      totalVisionCenters,
      totalSecondaryAdmins,
      totalFieldWorkers,
      totalPatients: todayPatients,
      todayPatients,
      villagesCovered: villages.length,
      totalReferrals: todayReferrals,
      todayReferrals,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Patients Per Day =================

const getPatientsPerDay = async (req, res) => {
  try {

    const data = await Patient.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Recent Activity =================

const getRecentActivity = async (req, res) => {
  try {

    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = recentPatients.map((patient) => ({
      icon: "account-check",
      title: `Patient ${patient.patientName} Registered`,
      time: patient.createdAt,
      color: "#1565C0",
    }));

    res.status(200).json({
      success: true,
      activities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Date Wise Report =================

const getReportByDate = async (req, res) => {
  try {

    const { date } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Patients
    const totalPatients = await Patient.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Referrals
    const totalReferrals = await Referral.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Villages Covered
    const villages = await Patient.distinct("village", {
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).json({
      success: true,
      date,
      totalPatients,
      totalReferrals,
      villagesCovered: villages.length,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getPatientReport = async (req, res) => {
  try {
    const { fromDate,toDate,district, visionCenter, search } = req.query;

    const filter = {};
    if (fromDate && toDate) {
  filter.createdAt = {
    $gte: new Date(fromDate),
    $lte: new Date(toDate),
   };
 }
    if (district) {
      filter.district = district;
    }

    if (visionCenter) {
      filter.visionCenter = visionCenter;
    }

    if (search) {
      filter.patientName = {
        $regex: search,
        $options: "i",
      };
    }

    const patients = await Patient.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      patients,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getDashboardStats,
  getPatientsPerDay,
  getRecentActivity,
  getReportByDate,
  getPatientReport,
};