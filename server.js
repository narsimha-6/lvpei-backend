const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

// Database Connection
const connectDB = require("./config/db");
const settingRoutes = require("./routes/settingRoutes");
const referralRoutes = require("./routes/referralRoutes");
const visionCenterRoutes = require("./routes/visionCenterRoutes");
const visionCenterAdminRoutes = require("./routes/visionCenterAdminRoutes");
const { protect } = require("./middleware/authMiddleware");
const { createReferral } = require("./controllers/referralController");
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected:", socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// ==================== Routes ====================

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Patient
app.use("/api/patients", require("./routes/patientRoutes"));

// Medical History
app.use(
  "/api/medical-history",
  require("./routes/medicalHistoryRoutes")
);

// Eye Screening
app.use(
  "/api/eye-screening",
  require("./routes/eyeScreeningRoutes")
);

// Diagnosis
app.use(
  "/api/diagnosis",
  require("./routes/diagnosisRoutes")
);

// Referral
app.post("/api/referral", protect, createReferral);
app.post("/api/referral/", protect, createReferral);
app.post("/api/referrals", protect, createReferral);
app.post("/api/referrals/", protect, createReferral);
app.use("/api/referral", referralRoutes);
app.use("/api/referrals", referralRoutes);

// Attachments
app.use(
  "/api/attachments",
  require("./routes/attachmentRoutes")
);

// Reports
app.use(
  "/api/reports",
  require("./routes/reportRoutes")
);
app.use("/api/settings", settingRoutes);
app.use("/api/regions", require("./routes/regionRoutes"));
app.use("/api/review", require("./routes/reviewRoutes"));
app.use("/api/vision-center", visionCenterRoutes);
app.use("/api/vision-centers", visionCenterRoutes);
app.use("/api/vision-center-admin", visionCenterAdminRoutes);
app.use("/api/vision-center-admins", visionCenterAdminRoutes);
app.use("/api/secondary-centers", require("./routes/secondaryCenterRouter"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
// ==================== Home Route ====================

app.get("/", (req, res) => {
  res.send("LVPEI Backend Running Successfully 🚀");
});
app.post("/api/test-referral", (req, res) => {
  res.json({
    success: true,
    message: "Referral route is working",
  });
});

// ==================== 404 Route ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ==================== Start Server ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  });
  } catch (error) {
    console.error("Server Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();