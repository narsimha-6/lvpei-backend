const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// Register
// ==========================
const register = async (req, res) => {
  try {
    const {
      employeeCode,
      name,
      mobile,
      email,
      password,
      role,
      region,
      visionCenter,
      secondaryCenter,
    } = req.body;

    const workerExists = await User.findOne({ employeeCode });

    if (workerExists) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await User.create({
      employeeCode,
      name,
      mobile,
      email,
      password: hashedPassword,
      role,
      region,
      visionCenter,
      secondaryCenter,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      worker,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Login
// ==========================
const login = async (req, res) => {
  try {

    const {
      employeeCode,
      password,
      role,
    } = req.body;

    // Find Employee
    const worker = await User.findOne({
      employeeCode,
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check Selected Role
    if (worker.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Check Password
    const match = await bcrypt.compare(
      password,
      worker.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: worker._id,
        role: worker.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      worker,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  register,
  login,
};