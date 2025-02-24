const mongoose = require("mongoose");
const bcrypt = require("bcrypt.js");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minLength: 6 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// client'a cevap göndermeden önce hassas verileri gizle
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};
// module oluşturulur.

const User = mongoose.model("User", userSchema);

module.exports = User;
