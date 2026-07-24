const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const employeeCode = "LVPEI-ADB-BEL-FW001";

    const newPassword = "123456";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { employeeCode },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found");
      process.exit();
    }

    console.log("✅ Password Reset Successful");
    console.log("Employee Code:", user.employeeCode);
    console.log("New Password:", newPassword);

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit();

  }
};

resetPassword();