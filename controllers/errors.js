const errors = {
  error404: (req, res) => res.status(404).json({ status: 'error', message: '無此頁面資訊' }),
  error: (err, req, res, next) => {
    if (res.headersSent) return next(err);
    let status = Number(err.statusCode || err.status) || 500;
    let message = err.message;
    let known = err.isOperational || false;
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      status = 400; known = true;
      message = err.name === 'ValidationError' ? `${Object.keys(err.errors)} 欄位未填寫正確` : `${err.kind} 未填寫正確`;
    }
    if (err.code === 11000) { status = 400; known = true; message = 'email 已被註冊'; }
    if (err.name === 'MulterError') {
      status = 400; known = true;
      message = err.code === 'LIMIT_FILE_SIZE'
        ? `圖片檔案過大，僅限 ${req.originalUrl.split('?')[0] === '/upload/avatar' ? '2' : '1'}mb 以下檔案`
        : '請選擇一張圖片';
    }
    if (err.type === 'entity.parse.failed') { status = 400; known = true; message = 'JSON 格式錯誤'; }
    if (!known) {
      console.error('API error:', err.name);
      message = '系統錯誤，請稍後再試';
      status = 500;
    }
    return res.status(status).json({ status: 'error', message });
  }
};
module.exports = errors;
