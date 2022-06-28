const mongoose = require("mongoose");
const { Schema } = mongoose;

const postsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user ID 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content 未填寫"],
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: "user",
      default: [],
    },
    comments: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Posts = mongoose.model("Posts", postsSchema);

module.exports = Posts;
