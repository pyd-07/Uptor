const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    name: { type: String, required: true },
    url: { type: String, required: true },

    interval_sec: { type: Number, default: 300 },
    timeout_ms: { type: Number, default: 5000 },

    is_active: { type: Boolean, default: true },

    last_status: {
      type: String,
      enum: ["up", "down", "unknown"],
      default: "unknown"
    },
    status_code: {
      type: Number,
      default: 0
    },
    last_checked_at: { type: Date, default: null },
    next_check_at: { type: Date, default: () => new Date(Date.now() + 300 * 1000) },
    response_time_ms: {type:Number, default: null},
  },
  { timestamps: true }
);

monitorSchema.index({ organizationId: 1, createdAt: -1 });
monitorSchema.index({ is_active: 1, next_check_at: 1 });

const Monitor = mongoose.model('Monitor', monitorSchema);

module.exports = {Monitor};
