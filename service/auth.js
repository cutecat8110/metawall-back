const jwt = require("jsonwebtoken");
const User = require("../models/user");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

const auth = {
  isAuth: handleErrorAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(appError(401, "你尚未登入！", next));
    }
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          if (err.message == "jwt expired")
            return appError("400", "認證已過期，請重新登入", next);
          if (err.message == "invalid token")
            return appError("400", "無效簽證", next);
          reject(err);
        } else {
          resolve(payload);
        }
      });
    });
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  }),
  generateJwt: (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY,
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
