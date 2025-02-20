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

// kullanıcıyı kaydetmeden önce şifreyi hashle

userSchema.pre("save", async function (next) {
  // şifre değişti mi kontrolü isModified
  if (!this.isModified("password")) return next();
  // hashlenme işlemi yapılır.
  try {
    const salt = bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});
// orjinal şifreyle hashlenmiş şifreyi karşılaştıran metod
// userSchemaya dışarıdan erişilebilecek bir metot tanımlanır methods ile doşarıdan compatePassword erişilebiliyor.
// candidate aday demektir.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
  //   şifreler aynıysa true, farklıysa false döndürür.
};

// client'a cevap göndermeden önce hassas verileri gizle
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};
// module oluşturulur.

const User = mongoose.model("User", userSchema);

module.exports = User;
