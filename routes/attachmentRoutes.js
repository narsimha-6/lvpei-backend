const express = require("express");

const router = express.Router();

const {
  createAttachment,
} = require("../controllers/attachmentController");

router.post("/", createAttachment);

module.exports = router;