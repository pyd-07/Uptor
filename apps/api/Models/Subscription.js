const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    plan: String,

    status: {
      type: String,
      enum: ["active", "trial", "expired"],
      default: "trial"
    },

    current_period_end: Date
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = {Subscription};