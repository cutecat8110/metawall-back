const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入 name"],
    },
    email: {
      type: String,
      required: [true, "請輸入 email"],
      unique: true,
      lowercase: true,
      select: false,
    },
    photo: { type: String, default: "" },
    sex: {
      type: String,
      default: "male",
      enum: ["male", "female"],
    },
    password: {
      type: String,
      required: [true, "請輸入 password"],
      minlength: 8,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    followers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "user" },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
    following: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "user" },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"],
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
