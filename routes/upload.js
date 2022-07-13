const express = require("express");
const router = express.Router();
const { isAuth } = require("../service/auth");
const checkSpec = require("../service/image");
const uploadsCON = require("../controllers/uploads");


// 上傳
router.post(
  "/avatar",
  isAuth,
  checkSpec.avatar,
  uploadsCON.checkFiles,
  uploadsCON.avatar
);
router.post(
  "/post",
  isAuth,
  checkSpec.avatar,
  uploadsCON.checkFiles,
  uploadsCON.post
);

module.exports = router;
