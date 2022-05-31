const handleSuccess = require("../service/handleSuccess");
const appError = require("../service/appError");

const Posts = require("../models/posts");
const User = require("../models/user");

const posts = {
  getAll: async (req, res, next) => {
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
  },
  create: async (req, res, next) => {
    
    const { user, image, content } = req.body;
    if (!content) return appError(400, "content 欄位為必填", next);
    if (!user) return appError(400, "user 欄位為必填", next);
    const id = await User.findById(user);
    if (!id) return appError(400, "user 不存在", next);
    const data = await Posts.create({
      user,
      image,
      content,
    });
    handleSuccess({ res, data });
  },
  deleteAll: async (req, res, next) => {
    const message = await Posts.deleteMany();
    handleSuccess({ res, message });
  },
  getOne: async (req, res, next) => {
    const id = req.params.id;
    const data = await Posts.findById(id);
    if (!data) return appError(400, "貼文不存在", next);
    handleSuccess({ res, data });
  },
  deleteOne: async (req, res, next) => {
    const id = req.params.id;
    const data = await Posts.findByIdAndDelete(id);
    if (!data) return appError(400, "貼文不存在", next);
    const message = "已刪除貼文";
    handleSuccess({ res, message });
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    const { likes } = req.body;
    const data = await Posts.findByIdAndUpdate(id, { likes }, { new: true });
    if (!data) return appError(400, "貼文不存在", next);
    handleSuccess({ res, data });
  },
};

module.exports = posts;
