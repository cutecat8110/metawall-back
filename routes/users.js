const express = require("express");
const router = express.Router();
const usersCON = require("../controllers/users");
const usersSpecs = require("../specs/users");
const { isAuth } = require("../service/auth");

router.post("/sign_up", usersCON.sign_up, usersSpecs.sign_up);
router.post("/sign_in", usersCON.sign_in, usersSpecs.sign_in);

router.get("/", isAuth, usersCON.getAll, usersSpecs.getAll);
router.patch("/updatePassword", isAuth, usersCON.updatePassword);
router.get("/profile", isAuth, usersCON.getProfile);
router.patch("/profile", isAuth, usersCON.updateProfile);

module.exports = router;
