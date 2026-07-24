const bcrypt = require("bcryptjs");

const VisionCenterAdmin = require("../models/visionCenterAdminModel");

// ==============================
// Get All Vision Center Admins
// ==============================
exports.getVisionCenterAdmins = async (req, res) => {
  try {
    const admins = await VisionCenterAdmin.find()
      .populate("visionCenter", "centerName centerCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Admin
// ==============================
exports.getVisionCenterAdminById = async (req, res) => {
  try {
    const admin = await VisionCenterAdmin.findById(req.params.id)
      .populate("visionCenter", "centerName centerCode");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Vision Center Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create Admin
// ==============================
exports.createVisionCenterAdmin = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      email,
      mobile,
      password,
      visionCenter,
    } = req.body;

    const employeeExists = await VisionCenterAdmin.findOne({
      employeeId,
    });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    const emailExists = await VisionCenterAdmin.findOne({
      email,
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await VisionCenterAdmin.create({
      employeeId,
      fullName,
      email,
      mobile,
      password: hashedPassword,
      visionCenter,
    });

    res.status(201).json({
      success: true,
      message: "Vision Center Admin created successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Admin
// ==============================
exports.updateVisionCenterAdmin = async (req, res) => {
  try {
    const admin = await VisionCenterAdmin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Vision Center Admin not found",
      });
    }

    admin.employeeId = req.body.employeeId;
    admin.fullName = req.body.fullName;
    admin.email = req.body.email;
    admin.mobile = req.body.mobile;
    admin.visionCenter = req.body.visionCenter;

    if (req.body.password && req.body.password.trim() !== "") {
      admin.password = await bcrypt.hash(req.body.password, 10);
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Vision Center Admin updated successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Change Status
// ==============================
exports.changeVisionCenterAdminStatus = async (req, res) => {
  try {
    const admin = await VisionCenterAdmin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Vision Center Admin not found",
      });
    }

    admin.status =
      admin.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};