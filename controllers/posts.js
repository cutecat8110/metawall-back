const mongoose = require("mongoose");
const handleSuccess = require("../service/handleSuccess");

const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");

const Post = require("../models/post");
const Comment = require("../models/comment");

const posts = {
  checkPost: handleErrorAsync(async (req, res, next) => {
    // 檢查貼文是否存在
    const id = req.params.id;
    const post = await Post.findById(id)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      });

    if (!post) return appError(400, "貼文不存在", next);
    req.post = post;
    next();
  }),
  create: handleErrorAsync(async (req, res, next) => {
    const { image, content } = req.body;

    // 欄位必填
    if (!content) return appError(400, "請輸入 content", next);

    const post = await Post.create({
      user: req.user.id,
      image,
      content,
    });

    const msg = {
      message: "貼文已創建",
      post,
    };
    handleSuccess(201, msg, res);
  }),
  getOne: handleErrorAsync(async (req, res, next) => {
    const msg = {
      post: req.post,
    };
    handleSuccess(200, msg, res);
  }),
  update: handleErrorAsync(async (req, res, next) => {
    const { image, content } = req.body;
    const author = req.post.user._id.toString();
    // 檢查編輯權限
    if (author !== req.user.id) return appError(403, "無編輯權限", next);

    // content 不能為空字串
    if (content == "") return appError(400, "content 不能為空字串", next);

    const post = await Post.findByIdAndUpdate(
      req.post._id,
      { image, content },
      { new: true }
    );
    const msg = { message: "貼文已更新", post };
    handleSuccess(200, msg, res);
  }),
  deleteOne: handleErrorAsync(async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.post._id);
    const msg = { message: "貼文已刪除" };
    if (post) return handleSuccess(200, msg, res);
  }),
  like: handleErrorAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(
      req.post._id,
      { $addToSet: { likes: req.user.id } },
      {
        new: true,
      }
    );

    const msg = {
      message: "已按讚",
      postId: post._id,
      userId: req.user.id,
    };
    handleSuccess(200, msg, res);
  }),
  unlike: handleErrorAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(
      req.post._id,
      { $pull: { likes: req.user.id } },
      {
        new: true,
      }
    );

    const msg = {
      message: "已取消按讚",
      postId: post._id,
      userId: req.user.id,
    };
    handleSuccess(200, msg, res);
  }),
  comment: handleErrorAsync(async (req, res, next) => {
    const user = req.user.id;
    const post = req.params.id;
    const { comment } = req.body;

    // 欄位必填
    if (!comment) return appError(400, "請輸入 comment", next);
    newComment = await Comment.create({ user, post, comment });

    const msg = {
      message: "已留言",
      comment: newComment,
    };
    handleSuccess(200, msg, res);
  }),
  getAll: handleErrorAsync(async (req, res, next) => {
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : undefined;
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    let p = undefined
    if (req.query.p !== undefined) {
      if (!mongoose.isValidObjectId(req.query.p)) return appError(400, "p 須符合 mongoose ObjectId 格式", next);
      p = { user: req.query.p }
    }
    const filter = {
      ...q,
      ...p
    }
    const posts = await Post.find(filter)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      })
      .sort(timeSort);
    handleSuccess(200, { posts }, res);
  }),
  deleteAll: handleErrorAsync(async (req, res, next) => {
    const posts = await Post.deleteMany();
    if (posts.deletedCount == 0) return appError(400, "目前尚無貼文", next);

    const msg = {
      message: "貼文已刪除",
      deletedCount: posts.deletedCount,
    };
    handleSuccess(200, msg, res);
  }),
};

module.exports = posts;
