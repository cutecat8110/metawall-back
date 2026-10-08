const multer = require('multer');
const path = require('path');

function imageUpload(maxBytes) {
  return multer({
    limits: { fileSize: maxBytes, files: 1 },
    fileFilter(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!['.jpg', '.png', '.jpeg'].includes(ext)) {
        const err = new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。');
        err.statusCode = 400; err.isOperational = true;
        return cb(err);
      }
      return cb(null, true);
    },
  }).any();
}
module.exports = { avatar: imageUpload(2 * 1024 * 1024), post: imageUpload(1024 * 1024) };
