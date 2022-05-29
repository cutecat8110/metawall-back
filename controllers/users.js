const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");

const User = require("../models/user");

const users = {
  getAll: handleErrorAsync(async (req, res) => {
    const data = await User.find();
    handleSuccess({ res, data });
  }),
};

module.exports = users;
