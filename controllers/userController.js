const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Region = require("../models/Region");
const SecondaryCenter = require("../models/SecondaryCenter");

// Create Secondary Center Admin

const createSecondaryCenterAdmin = async (req, res) => {

  try {

    const {
      employeeCode,
      name,
      mobile,
      email,
      password,
      region,
      secondaryCenter,
    } = req.body;

    // Check Employee Code

    const existingEmployee = await User.findOne({
      employeeCode,
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee Code already exists",
      });
    }

    // Check Mobile

    const existingMobile = await User.findOne({
      mobile,
    });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Verify Region

    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    // Verify Secondary Center

    const centerExists = await SecondaryCenter.findById(
      secondaryCenter
    );

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Secondary Center not found",
      });
    }

    // Encrypt Password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User

    const user = await User.create({

      employeeCode,

      name,

      mobile,

      email,

      password: hashedPassword,

      role: "SECONDARY_CENTER_ADMIN",

      region,

      secondaryCenter,

    });

    res.status(201).json({

      success: true,

      message: "Secondary Center Admin Created Successfully",

      user,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
const jwt = require("jsonwebtoken");

// Login User
const loginUser = async (req, res) => {
  try {

    const { employeeCode, password } = req.body;

    // Find User
    const user = await User.findOne({ employeeCode });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee Code not found",
      });
    }

    // Check Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Update Last Login
    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const VisionCenter = require("../models/VisionCenter");

// Create Field Worker
const createFieldWorker = async (req, res) => {
  try {
    const {
      employeeCode,
      name,
      mobile,
      email,
      password,
      region,
      visionCenter,
    } = req.body;

    // Employee Code Check
    const employeeExists = await User.findOne({ employeeCode });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee Code already exists",
      });
    }

    // Mobile Check
    const mobileExists = await User.findOne({ mobile });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    // Region Check
    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    // Vision Center Check
    const centerExists = await VisionCenter.findById(
      visionCenter
    );

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create User
    const user = await User.create({
      employeeCode,
      name,
      mobile,
      email,
      password: hashedPassword,
      role: "FIELD_WORKER",
      region,
      visionCenter,
    });

    res.status(201).json({
      success: true,
      message: "Field Worker Created Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// Create First Admin
const createAdmin = async (req, res) => {
  try {

    const adminExists = await User.findOne({
      role: "ADMIN",
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash("lvpei123", 10);

    const admin = await User.create({
      employeeCode: "LVPEI-ADM001",
      name: "LVPEI Administrator",
      mobile: "9999999999",
      email: "admin@lvpei.org",
      password: hashedPassword,
      role: "ADMIN",
    });

    res.status(201).json({
      success: true,
      message: "Admin Created Successfully",
      admin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get All Secondary Center Admins =================

const getSecondaryCenterAdmins = async (req, res) => {
  try {
    const users = await User.find({
      role: "SECONDARY_CENTER_ADMIN",
    })
      .populate("region")
      .populate("secondaryCenter")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get Secondary Center Admin By ID =================

const getSecondaryCenterAdminById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "SECONDARY_CENTER_ADMIN",
    })
      .populate("region")
      .populate("secondaryCenter");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Secondary Center Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= Update Secondary Center Admin =================

const updateSecondaryCenterAdmin = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      region,
      secondaryCenter,
    } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: "SECONDARY_CENTER_ADMIN",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Secondary Center Admin not found",
      });
    }

    // Check duplicate mobile
    const mobileExists = await User.findOne({
      _id: { $ne: req.params.id },
      mobile,
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Check Region
    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    // Check Secondary Center
    const centerExists =
      await SecondaryCenter.findById(
        secondaryCenter
      );

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Secondary Center not found",
      });
    }

    user.name = name;
    user.mobile = mobile;
    user.email = email;
    user.region = region;
    user.secondaryCenter = secondaryCenter;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Secondary Center Admin Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Change Secondary Center Admin Status =================

const changeSecondaryCenterAdminStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: "SECONDARY_CENTER_ADMIN",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Secondary Center Admin not found",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= Get All Field Workers =================

const getFieldWorkers = async (req, res) => {
  try {
    const users = await User.find({
      role: "FIELD_WORKER",
    })
      .populate("region")
      .populate("visionCenter")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get Field Worker By ID =================

const getFieldWorkerById = async (req, res) => {
  try {

    const user = await User.findOne({
      _id: req.params.id,
      role: "FIELD_WORKER",
    })
      .populate("region")
      .populate("visionCenter");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Field Worker not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Update Field Worker =================

const updateFieldWorker = async (req, res) => {
  try {

    const {
      name,
      mobile,
      email,
      region,
      visionCenter,
    } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: "FIELD_WORKER",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Field Worker not found",
      });
    }

    const mobileExists = await User.findOne({
      _id: { $ne: req.params.id },
      mobile,
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    const centerExists =
      await VisionCenter.findById(visionCenter);

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    user.name = name;
    user.mobile = mobile;
    user.email = email;
    user.region = region;
    user.visionCenter = visionCenter;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Field Worker Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Change Field Worker Status =================

const changeFieldWorkerStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: "FIELD_WORKER",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Field Worker not found",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Create Vision Center Admin =================

const createVisionCenterAdmin = async (req, res) => {
  try {
    const {
      employeeCode,
      name,
      mobile,
      email,
      password,
      region,
      visionCenter,
    } = req.body;

    // Employee Code Check
    const existingEmployee = await User.findOne({ employeeCode });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee Code already exists",
      });
    }

    // Mobile Check
    const existingMobile = await User.findOne({ mobile });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Region Check
    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    // Vision Center Check
    const centerExists = await VisionCenter.findById(visionCenter);

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    // Check if this Vision Center already has an admin
    const adminExists = await User.findOne({
      role: "VISION_CENTER_ADMIN",
      visionCenter,
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Vision Center Admin already assigned",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      employeeCode,
      name,
      mobile,
      email,
      password: hashedPassword,
      role: "VISION_CENTER_ADMIN",
      region,
      visionCenter,
    });

    res.status(201).json({
      success: true,
      message: "Vision Center Admin Created Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get Vision Center Admin By ID =================

const getVisionCenterAdminById = async (req, res) => {
  try {

    const user = await User.findOne({
      _id: req.params.id,
      role: "VISION_CENTER_ADMIN",
    })
      .populate("region")
      .populate("visionCenter");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Vision Center Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Update Vision Center Admin =================

const updateVisionCenterAdmin = async (req, res) => {
  try {

    const {
      name,
      mobile,
      email,
      region,
      visionCenter,
    } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: "VISION_CENTER_ADMIN",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Vision Center Admin not found",
      });
    }

    const mobileExists = await User.findOne({
      _id: { $ne: req.params.id },
      mobile,
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    const centerExists = await VisionCenter.findById(visionCenter);

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    user.name = name;
    user.mobile = mobile;
    user.email = email;
    user.region = region;
    user.visionCenter = visionCenter;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vision Center Admin Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Change Vision Center Admin Status =================

const changeVisionCenterAdminStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: "VISION_CENTER_ADMIN",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Vision Center Admin not found",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= Get All Vision Center Admins =================

const getVisionCenterAdmins = async (req, res) => {
  try {
    const users = await User.find({
      role: "VISION_CENTER_ADMIN",
    })
      .populate("region", "regionName regionCode")
      .populate("visionCenter", "centerName centerCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
    createAdmin,
    loginUser,

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

};
