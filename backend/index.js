const express = require('express');
const connectDB = require('../db');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./Routes/auth/auth');
const monitorRoutes = require('./Routes/monitors/monitors');
const alertRoutes = require('./Routes/alerts/alerts');
const billingRoutes = require('./Routes/billing/status');
const organizationRoutes = require('./Routes/organization/organization');

app.use("/auth", authRoutes);
app.use("/monitors", monitorRoutes);
app.use("/alerts", alertRoutes);
app.use("/billing", billingRoutes);
app.use("/organization", organizationRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT;

try {
  async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  }
} catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); 
}
