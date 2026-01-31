const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    name: String,
    url: { type: String, required: true },

    interval_sec: { type: Number, default: 300 },
    timeout_ms: { type: Number, default: 5000 },

    is_active: { type: Boolean, default: true },

    last_status: {
      type: String,
      enum: ["up", "down", "unknown"],
      default: "unknown"
    },

    last_checked_at: { type: Date, default: null },
    next_check_at: { type: Date, default: () => new Date(Date.now() + 300 * 1000) },
  },
  { timestamps: true }
);

monitorSchema.index({ organizationId: 1 });
monitorSchema.index({ is_active: 1, next_check_at: 1 });

const Monitor = mongoose.model('Monitor', monitorSchema);

module.exports = {Monitor};