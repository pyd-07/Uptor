process.on("unhandledRejection", (err) => {
  console.error("[FATAL] Unhandled Rejection:", err)
})

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err)
  process.exit(1)
})

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require('../db');
const app = express();
app.set("trust proxy", 1);

app.use(cors({
  origin: "https://uptor.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./Routes/auth/auth');
const monitorRoutes = require('./Routes/monitors/monitors');
const alertRoutes = require('./Routes/alerts/alerts');
const organizationRoutes = require('./Routes/organization/organization');
const dashboardRoutes = require('./Routes/dashboard/dashboard');

app.use("/auth", authRoutes);
app.use("/monitors", monitorRoutes);
app.use("/alerts", alertRoutes);
app.use("/organization", organizationRoutes);
app.use("/", dashboardRoutes);

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  if (dbState !== 1) {
    return res.status(500).json({
      status: "error",
      database: states[dbState],
      time: new Date().toISOString(),
    });
  }
  res.json({
    status: "ok",
    database: "connected",
    uptime_seconds: process.uptime(),
    time: new Date().toISOString(),
  });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});


const PORT = process.env.PORT || 8080;
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, ()=>{
      console.log("App is listening on port:", PORT);
    });

    require("../workers/uptimeWorker")
    require("../workers/alertWorker")
  } catch (err) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
