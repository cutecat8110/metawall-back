const handleError = ({ res, err }) => {
  const message = err.message || err;
  res.status(400).json({
    status: "false",
    message,
  });
};

module.exports = handleError;
