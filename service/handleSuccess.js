const handleSuccess = (httpStatus, msg, res) => {
  res.status(httpStatus).json({
    status: "success",
    ...msg,
  });
};

module.exports = handleSuccess;
