const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    name: String,

    role: {
      type: String,
      enum: ["Owner", "Member"],
      default: "Member"
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = {User}
