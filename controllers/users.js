const handleSuccess = require("../service/handleSuccess");
const User = require("../models/user");

const users = {
  getAll: async (req, res) => {
    const data = await User.find();
    handleSuccess({ res, data });
  },
};

module.exports = users;
