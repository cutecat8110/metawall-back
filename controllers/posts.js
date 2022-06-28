const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");

const Posts = require("../models/posts");
const User = require("../models/user");

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

    const data = await Posts.create({
      user: req.user.id,
      image,
      content,
    });
    handleSuccess({ res, data });
  }),
  getOne: handleErrorAsync(async (req, res, next) => {
    const data = req.post;
    handleSuccess({ res, data });
  }),
  update: handleErrorAsync(async (req, res, next) => {
    const { image, content } = req.body;

    // 檢查編輯權限
    if (req.post.user.toString() !== req.user.id)
      return appError(403, "無編輯權限", next);

    // content 不能為空字串
    if (content == "") return appError(400, "content 不能為空字串", next);

    const data = await Posts.findByIdAndUpdate(
      req.post.id,
      { image, content },
      { new: true }
    );
    handleSuccess({ res, data });
  }),
  like: handleErrorAsync(async (req, res, next) => {
    // 檢查是否已按讚
    const like = req.post.likes.includes(req.user.id)
      ? { $pull: { likes: req.user.id } }
      : { $addToSet: { likes: req.user.id } };

    const data = await Posts.findByIdAndUpdate(req.post.id, like, {
      new: true,
    });
    handleSuccess({ res, data });
  }),
  deleteOne: handleErrorAsync(async (req, res, next) => {
    const data = await Posts.findByIdAndDelete(req.post.id);
    if (data) return handleSuccess({ res, message: "貼文已刪除" });
  }),
  getAll: handleErrorAsync(async (req, res, next) => {
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const data = await Posts.find(q)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    handleSuccess({ res, data });
  }),
  deleteAll: handleErrorAsync(async (req, res, next) => {
    const message = await Posts.deleteMany();
    handleSuccess({ res, message });
  }),
};

module.exports = posts;
