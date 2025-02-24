const mongoose = require("mongoose");
const bcrypt = require("bcrypt.js");

const productSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  {
    timestamps: true,
  }
);

// client'a cevap göndermeden önce hassas verileri gizle
productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};
// module oluşturulur.

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
