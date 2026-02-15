const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    mail: {type:String, required:true},
    name: { type: String, required: true },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },

    monitor_limit: { type: Number, default: 5 },

    used_monitors: {type: Number, default: 0},

    can_create_monitor: {type: Boolean, default:true}
  },
  { timestamps: true }
);

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = {Organization}
