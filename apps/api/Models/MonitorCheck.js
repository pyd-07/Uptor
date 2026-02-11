const mongoose = require('mongoose');

const monitorCheckSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true
    },
    had_response:{
        type: Boolean,
        default: true
    },
    status: {
      type: String,
      enum: ["up", "down","unknown"],
      required: true
    },

    response_time_ms: Number,
    status_code: Number,

    checked_at: { type: Date, default: Date.now() },
    error: {type: String, default:null}
  }
);

monitorCheckSchema.index(
  { checked_at: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 } // 7 days
);

const MonitorCheck = mongoose.model('MonitorCheck', monitorCheckSchema);

module.exports = {MonitorCheck};