const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "請輸入 comment"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "請輸入 user ID"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      require: [true, "請輸入 post ID"],
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

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name id createdAt",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
