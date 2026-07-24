const Region = require("../models/Region");

// =========================
// Create Region
// =========================
const createRegion = async (req, res) => {
  try {
    const { regionName, regionCode } = req.body;

    if (!regionName || !regionCode) {
      return res.status(400).json({
        success: false,
        message: "Region Name and Region Code are required",
      });
    }

    const existingRegion = await Region.findOne({
      $or: [
        { regionName: regionName.trim() },
        { regionCode: regionCode.trim().toUpperCase() },
      ],
    });

    if (existingRegion) {
      return res.status(400).json({
        success: false,
        message: "Region already exists",
      });
    }

    const region = await Region.create({
      regionName: regionName.trim(),
      regionCode: regionCode.trim().toUpperCase(),
    });

    res.status(201).json({
      success: true,
      message: "Region Created Successfully",
      region,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Regions
// =========================
const getRegions = async (req, res) => {
  try {
    const regions = await Region.find().sort({
      regionName: 1,
    });

    res.status(200).json({
      success: true,
      regions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Region By ID
// =========================
const getRegionById = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    res.status(200).json({
      success: true,
      region,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Region
// =========================
const updateRegion = async (req, res) => {
  try {
    const { regionName, regionCode } = req.body;

    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    const duplicate = await Region.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { regionName: regionName.trim() },
        { regionCode: regionCode.trim().toUpperCase() },
      ],
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Region Name or Code already exists",
      });
    }

    region.regionName = regionName.trim();
    region.regionCode = regionCode.trim().toUpperCase();

    await region.save();

    res.status(200).json({
      success: true,
      message: "Region Updated Successfully",
      region,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Change Status
// =========================
const changeRegionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    region.status = status;

    await region.save();

    res.status(200).json({
      success: true,
      message: "Region Status Updated",
      region,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Region
// =========================
const deleteRegion = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    await region.deleteOne();

    res.status(200).json({
      success: true,
      message: "Region Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  changeRegionStatus,
  deleteRegion,
};