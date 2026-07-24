const VisionCenter = require("../models/VisionCenter");
const Region = require("../models/Region");

// ==========================
// Create Vision Center
// ==========================
const createVisionCenter = async (req, res) => {
  try {
    const {
      centerCode,
      centerName,
      region,
      district,
      address,
      phone,
      email,
    } = req.body;

    const regionExists = await Region.findById(region);

    if (!regionExists) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    const existing = await VisionCenter.findOne({ centerCode });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Vision Center Code already exists",
      });
    }

    const visionCenter = await VisionCenter.create({
      centerCode,
      centerName,
      region,
      district,
      address,
      phone,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Vision Center Created Successfully",
      visionCenter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Vision Centers
// ==========================
const getVisionCenters = async (req, res) => {
  try {
    const centers = await VisionCenter.find()
      .populate("region", "regionName regionCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: centers.length,
      visionCenters: centers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Vision Center By ID
// ==========================
const getVisionCenterById = async (req, res) => {
  try {
    const center = await VisionCenter.findById(req.params.id)
      .populate("region", "regionName regionCode");

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    res.status(200).json({
      success: true,
      visionCenter: center,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Vision Center
// ==========================
const updateVisionCenter = async (req, res) => {
  try {
    const center = await VisionCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    Object.assign(center, req.body);

    await center.save();

    res.status(200).json({
      success: true,
      message: "Vision Center Updated Successfully",
      visionCenter: center,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Change Vision Center Status
// ==========================
const changeVisionCenterStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const center = await VisionCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Vision Center not found",
      });
    }

    center.status = status;

    await center.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      visionCenter: center,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVisionCenter,
  getVisionCenters,
  getVisionCenterById,
  updateVisionCenter,
  changeVisionCenterStatus,
};