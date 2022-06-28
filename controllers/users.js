const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const appError = require("../service/appError");

const { generateJwt } = require("../service/auth");

const users = {
  getAll: handleErrorAsync(async (req, res, next) => {
    const data = await User.find();
    handleSuccess({ res, data });
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
    const data = req.user;
    handleSuccess({ res, data });
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

    const data = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        photo,
        sex,
      },
      { new: true, runValidators: true }
    );
    handleSuccess({ res, data });
  }),
};

module.exports = users;
