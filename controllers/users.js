const mongoose = require("mongoose");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const User = require("../models/user");
const Post = require("../models/post");

const bcrypt = require("bcryptjs");
const validator = require("validator");
const appError = require("../service/appError");

const { generateJwt } = require("../service/auth");

const users = {
  checkLogin: handleErrorAsync(async (req, res, next) => {
    const msg = { message: "已登入" };
    handleSuccess(200, msg, res);
  }),
  getAll: handleErrorAsync(async (req, res, next) => {
    const users = await User.find();
    handleSuccess(200, { users }, res);
  }),
  deleteAll: handleErrorAsync(async (req, res, next) => {
    const user = await User.deleteMany();
    if (user.deletedCount == 0) return appError(400, "目前尚無用戶", next);

    const msg = {
      message: "用戶已刪除",
      deletedCount: user.deletedCount,
    };
    handleSuccess(200, msg, res);
  }),
  sign_up: handleErrorAsync(async (req, res, next) => {
    let { name, email, password } = req.body;

    // 欄位必填
    if (!name || !email || !password)
      return appError("400", "請輸入 name、email 和 password", next);
    // name 至少 2 碼
    if (!validator.isLength(name, { min: 2 }))
      return appError("400", "name 請輸入至少 2 個字元", next);
    // password 須符合格式
    if (!validator.isStrongPassword(password, { minSymbols: 0 }))
      return appError(
        "400",
        "password 請輸入至少 8 個字元，需包含大小寫和數字",
        next
      );
    // email 須符合格式
    if (!validator.isEmail(email))
      return appError("400", "email 需符合格式", next);
    // email 只能註冊 1 次
    const newEmail = await User.findOne({ email });
    if (newEmail) return appError("400", "email 已被註冊", next);

    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password,
    });
    generateJwt(newUser, 201, res);
  }),
  sign_in: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 欄位必填
    if (!email || !password)
      return appError(400, "請輸入 email 和 password", next);
    const user = await User.findOne({ email }).select("+password");
    // 用戶需存在
    if (!user) return appError(400, "email 或 password 錯誤", next);
    // password 需正確
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return appError(400, "email 或 password 錯誤", next);

    generateJwt(user, 200, res);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    // 欄位必填
    if (!password || !confirmPassword)
      return appError(400, "請輸入 password 和 confirmPassword", next);
    // password 和 confirmPassword 需一致
    if (password !== confirmPassword)
      return appError(400, "password 和 confirmPassword 需一致", next);
    // password 須符合格式
    if (!validator.isStrongPassword(password, { minSymbols: 0 }))
      return appError(
        "400",
        "password 請輸入至少 8 個字元，需包含大小寫和數字",
        next
      );

    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    generateJwt(user, 201, res);
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return appError(400, "請輸入 user id", next);
    if (!mongoose.isValidObjectId(id)) return appError(400, "user id 須符合 mongoose ObjectId 格式", next);
    
    const user = await User.findById(id)
    if (!user) return appError(400, "用戶不存在", next);

    const msg = { user: user };
    handleSuccess(200, msg, res);
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { name, photo, sex } = req.body;

    // name 不能為空字串
    if (name == "") return next(appError(400, "name 不能為空字串", next));
    // photo 不能為空字串
    if (photo == "") return next(appError(400, "photo 不能為空字串", next));
    // sex 須符合枚舉
    if (sex !== undefined && !validator.isIn(sex, ["male", "female"]))
      return next(appError(400, "sex 須符合枚舉 male 或 female", next));

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        photo,
        sex,
      },
      { new: true, runValidators: true }
    );

    const msg = {
      message: "用戶資訊已更新",
      user,
    };
    handleSuccess(200, msg, res);
  }),
  getLikeList: handleErrorAsync(async (req, res, next) => {
    const posts = await Post.find({ likes: req.user.id }).populate({
      path: "user",
      select: "name photo",
    });
    handleSuccess(200, { posts }, res);
  }),
  follow: handleErrorAsync(async (req, res, next) => {
    const followID = req.params.id;
    const userID = req.user.id;

    if (followID == userID)
      return appError(400, "follow 須為自己以外的對象", next);

    await User.updateOne(
      { _id: userID, "following.user": { $ne: followID } },
      {
        $addToSet: { following: { user: followID } },
      }
    );
    await User.updateOne(
      { _id: followID, "followers.user": { $ne: userID } },
      {
        $addToSet: { followers: { user: userID } },
      }
    );

    const msg = { message: "已成功追蹤" };
    handleSuccess(200, msg, res);
  }),
  unFollow: handleErrorAsync(async (req, res, next) => {
    const unFollowID = req.params.id;
    const userID = req.user.id;

    if (unFollowID == userID)
      return appError(400, "unFollow 須為自己以外的對象", next);

    await User.findByIdAndUpdate(userID, {
      $pull: { following: { user: unFollowID } },
    });
    await User.findByIdAndUpdate(unFollowID, {
      $pull: { followers: { user: userID } },
    });

    const msg = { message: "已取消追蹤" };
    handleSuccess(200, msg, res);
  }),
};

module.exports = users;
