const handleSuccess = ({ data, res, message }) => {
  res.status(200).json({
    status: "success",
    data,
    message,
  });
};

module.exports = handleSuccess;
