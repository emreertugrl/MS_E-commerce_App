const mongoose = require("mongoose");
const bcrypt = require("bcrypt.js");

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minLength: 6 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ["order", "admin"], default: "order" },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// client'a cevap göndermeden önce hassas verileri gizle
orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};
// module oluşturulur.

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
