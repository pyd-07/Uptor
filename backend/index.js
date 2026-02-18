const express = require('express');
const connectDB = require('../db');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");

require("dotenv").config({path:'../.env'});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
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
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use((err, req, res, next) => {
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
  } catch (err) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
