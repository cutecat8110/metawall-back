const express = require("express");
const router = express.Router();
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const sizeOf = require("image-size");
const { isAuth } = require("../service/auth");
const upload = require("../service/image");
const { ImgurClient } = require("imgur");

// 上傳
router.post(
  "/",
  isAuth,
  upload,
  handleErrorAsync(async (req, res, next) => {
    if (!(req.files || []).length) return appError(400, "尚未上傳檔案", next);
    const dimensions = sizeOf(req.files[0].buffer);
    if (dimensions.width !== dimensions.height)
      return appError(400, "圖片尺寸須符合 1:1 長寬比", next);

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const response = await client.upload({
      image: req.files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });
    console.log(response)
    const msg = {
      message: "圖片已上傳",
      imgUrl: response.data.link,
    };
    handleSuccess(200, msg, res);
  })
);

module.exports = router;
