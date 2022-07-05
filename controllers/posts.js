const handleSuccess = require("../service/handleSuccess");

const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");

const Posts = require("../models/posts");

const posts = {
  checkPost: handleErrorAsync(async (req, res, next) => {
    // 檢查貼文是否存在
    const id = req.params.id;
    const post = await Posts.findById(id);
    if (!post) return appError(400, "貼文不存在", next);
    req.post = post;
    next();
  }),
  create: handleErrorAsync(async (req, res, next) => {
    const { image, content } = req.body;

    // 欄位必填
    if (!content) return appError(400, "請輸入 content", next);

    const post = await Posts.create({
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

    // 檢查編輯權限
    if (req.post.user.toString() !== req.user.id)
      return appError(403, "無編輯權限", next);

    // content 不能為空字串
    if (content == "") return appError(400, "content 不能為空字串", next);

    const post = await Posts.findByIdAndUpdate(
      req.post.id,
      { image, content },
      { new: true }
    );
    const msg = { message: "貼文已更新", post };
    handleSuccess(200, msg, res);
  }),
  like: handleErrorAsync(async (req, res, next) => {
    const post = await Posts.findByIdAndUpdate(
      req.post.id,
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
    const post = await Posts.findByIdAndUpdate(
      req.post.id,
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
  deleteOne: handleErrorAsync(async (req, res, next) => {
    const post = await Posts.findByIdAndDelete(req.post.id);
    const msg = { message: "貼文已刪除" };
    if (post) return handleSuccess(200, msg, res);
  }),
  getAll: handleErrorAsync(async (req, res, next) => {
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const posts = await Posts.find(q)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    handleSuccess(200, { posts }, res);
  }),
  deleteAll: handleErrorAsync(async (req, res, next) => {
    const posts = await Posts.deleteMany();
    if (posts.deletedCount == 0) return appError(400, "目前尚無貼文", next);

    const msg = {
      message: "貼文已刪除",
      deletedCount: posts.deletedCount,
    };
    handleSuccess(200, msg, res);
  }),
};

module.exports = posts;
