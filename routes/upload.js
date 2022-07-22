const express = require("express");
const router = express.Router();
const { isAuth } = require("../service/auth");
const checkSpec = require("../service/image");
const uploadsCON = require("../controllers/uploads");
const uploadSpec = require("../specs/upload");

// 上傳
router.post(
  "/avatar",
  isAuth,
  checkSpec.avatar,
  uploadsCON.checkFiles,
  uploadsCON.avatar,
  uploadSpec.avatar
);
router.post(
  "/post",
  isAuth,
  checkSpec.post,
  uploadsCON.checkFiles,
  uploadsCON.post,
  uploadSpec.post
);

module.exports = router;
