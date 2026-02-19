const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true
    },

    type: {
      type: String,
      enum: ["down", "recovery", "unknown"],
      required: true
    },

    result: {type: Object, required:true},
    status: {type: String, enum: ["pending", "sent", "processing", "failed"], default:"pending"},

    sent_via: {type: String, default:"Email"},
    sent_at: { type: Date, default: null },
    tries: { type: Number, default: 0 }
  }
);

alertSchema.index({ status: 1, tries: 1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = {Alert};
