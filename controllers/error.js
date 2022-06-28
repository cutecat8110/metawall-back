const resProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("出現重大錯誤", err);
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};

const resDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const error = {
  // 404
  error404: (req, res, next) => {
    res.status(404).json({
      status: "error",
      message: "無此頁面資訊",
    });
    next();
  },
  // 錯誤處理
  error: (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "dev") return resDev(err, res);

    if (err.name === "ValidationError") {
      const key = Object.keys(err.errors).toString();
      err.message = `${key} 欄位未填寫正確`;
      err.isOperational = true;
    }
    if (err.name === "CastError") {
      err.message = `${err.kind} 未填寫正確`;
      err.isOperational = true;
    }
    resProd(err, res);
    next();
  },
  // 捕捉程式重大錯誤
  uncaughtException: process.on("uncaughtException", (err) => {
    console.error("Uncaughted Exception！");
    console.error(err.name);
    console.error(err.message);
    process.exit(1);
  }),
  // 未捕捉到的 catch
  unhandledRejection: process.on("unhandledRejection", (reason, promise) => {
    console.error("未捕捉到的 rejection：", promise, "原因：", reason);
  }),
};

module.exports = error;
