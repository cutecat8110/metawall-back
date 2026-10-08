const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const auth = {
  isAuth: handleErrorAsync(async (req, res, next) => {
    const token = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || "")?.[1];
    if (!token) {
      return appError(401, "你尚未登入！", next);
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return appError(401, err.name === "TokenExpiredError" ? "認證已過期，請重新登入" : "無效簽證，請重新登入", next);
    }
    if (!mongoose.isObjectIdOrHexString(decoded.id)) return appError(401, "無效簽證，請重新登入", next);
    const currentUser = await User.findById(decoded.id).select("+passwordVersion").populate({
          path: "following.user",
          select: "name photo",
        });
    if (!currentUser) return appError(401, "用戶不存在，請重新登入", next);
    // Tokens issued before this field existed represent version zero.
    if ((decoded.passwordVersion ?? 0) !== (currentUser.passwordVersion ?? 0))
      return appError(401, "密碼已更新，請重新登入", next);
    currentUser.passwordVersion = undefined;
    req.user = currentUser;
    next();
  }),
  isAdmin: (req, res, next) => {
    if (req.user?.role !== "admin") return appError(403, "無管理權限", next);
    next();
  },
  generateJwt: (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id, passwordVersion: user.passwordVersion ?? 0 }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY,
      algorithm: "HS256",
    });
    user.password = undefined;
    res.status(statusCode).json({
      status: "success",
      user: {
        token,
        name: user.name,
      },
    });
  },
};

module.exports = auth;
