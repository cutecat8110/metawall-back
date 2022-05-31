const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const handleErrorAsync = require("../service/handleErrorAsync");

router.get("/", handleErrorAsync(usersControllers.getAll));

module.exports = router;
