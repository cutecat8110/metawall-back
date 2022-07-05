const express = require("express");
const router = express.Router();
const usersCON = require("../controllers/users");
const usersSpecs = require("../specs/users");
const { isAuth } = require("../service/auth");

router.post("/user/sign_up", usersCON.sign_up, usersSpecs.sign_up);
router.post("/user/sign_in", usersCON.sign_in, usersSpecs.sign_in);

router.patch("/user/updatePassword", isAuth, usersCON.updatePassword);
router.get("/user/profile", isAuth, usersCON.getProfile);
router.patch("/user/profile", isAuth, usersCON.updateProfile);
router.get("/user/likeList", isAuth, usersCON.getLikeList);

router.get("/users", isAuth, usersCON.getAll, usersSpecs.getAll);

module.exports = router;
