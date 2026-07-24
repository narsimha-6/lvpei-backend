const SecondaryCenter = require("../models/SecondaryCenter");

// Create Secondary Center
const createSecondaryCenter = async (req, res) => {
  try {

    const {
      centerName,
      centerCode,
      region,
    } = req.body;

    const existingCenter = await SecondaryCenter.findOne({
      $or: [
        { centerName },
        { centerCode }
      ]
    });

    if (existingCenter) {
      return res.status(400).json({
        success: false,
        message: "Secondary Center already exists",
      });
    }

    const center = await SecondaryCenter.create({
      centerName,
      centerCode,
      region,
    });

    res.status(201).json({
      success: true,
      message: "Secondary Center Created Successfully",
      center,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get All Secondary Centers
const getSecondaryCenters = async (req, res) => {

  try {

    const centers = await SecondaryCenter.find()
      .populate("region")
      .sort({ centerName: 1 });

    res.status(200).json({
      success: true,
      centers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// Update Secondary Center
const updateSecondaryCenter = async (req, res) => {
  try {

    const { centerName, centerCode, region } = req.body;

    const center = await SecondaryCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Secondary Center not found",
      });
    }

    center.centerName = centerName;
    center.centerCode = centerCode;
    center.region = region;

    await center.save();

    res.status(200).json({
      success: true,
      message: "Secondary Center Updated Successfully",
      center,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createSecondaryCenter,
  getSecondaryCenters,
  updateSecondaryCenter,
};