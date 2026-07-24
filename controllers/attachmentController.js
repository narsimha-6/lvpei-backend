const Attachment = require("../models/Attachment");

// Create Attachment
const createAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Attachments Saved Successfully",
      attachment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAttachment,
};