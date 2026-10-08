const handleSuccess = require('../service/handleSuccess');
const handleErrorAsync = require('../service/handleErrorAsync');
const appError = require('../service/appError');
const sharp = require('sharp');
const { ImgurClient } = require('imgur');

async function uploadImage(req, res, next, album) {
  try {
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({ image: req.files[0].buffer.toString('base64'), type: 'base64', album });
    const imgUrl = response?.data?.link;
    if (response?.success === false || typeof imgUrl !== 'string' || !/^https:\/\//.test(imgUrl)) {
      return appError(502, '圖片服務暫時無法上傳，請稍後再試', next);
    }
    return handleSuccess(200, { message: '圖片已上傳', imgUrl }, res);
  } catch (err) {
    return appError(502, '圖片服務暫時無法上傳，請稍後再試', next);
  }
}
module.exports = {
  checkFiles: handleErrorAsync(async (req, res, next) => {
    if (!req.files?.length) return appError(400, '尚未上傳檔案', next);
    try {
      const image = sharp(req.files[0].buffer, { failOn: 'warning' });
      const dimensions = await image.metadata();
      if (!['jpeg', 'png'].includes(dimensions.format) || !dimensions.width || !dimensions.height) throw new Error('invalid image');
      // Decode the pixel data as well: a valid header alone can hide a truncated image.
      await image.stats();
      req.imageDimensions = dimensions;
    } catch (err) {
      return appError(400, '圖片內容損壞或格式錯誤，僅限 JPG、PNG 圖片', next);
    }
    next();
  }),
  avatar: handleErrorAsync(async (req, res, next) => {
    if (req.imageDimensions.width !== req.imageDimensions.height) return appError(400, '圖片尺寸須符合 1:1 長寬比', next);
    return uploadImage(req, res, next, process.env.IMGUR_ALBUM_ID);
  }),
  post: handleErrorAsync(async (req, res, next) => uploadImage(req, res, next, process.env.IMGUR_ALBUM_2_ID)),
};
