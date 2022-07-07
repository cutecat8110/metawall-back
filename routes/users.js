const express = require("express");
const router = express.Router();
const userCON = require("../controllers/users");
const userSpec = require("../specs/user");
const { isAuth } = require("../service/auth");

router.post("/user/sign_up", userCON.sign_up, userSpec.sign_up);
router.post("/user/sign_in", userCON.sign_in, userSpec.sign_in);

router.patch("/user/updatePassword", isAuth, userCON.updatePassword);
router.get("/user/profile", isAuth, userCON.getProfile);
router.patch("/user/profile", isAuth, userCON.updateProfile);
router.get("/user/likeList", isAuth, userCON.getLikeList);

router.post("/user/:id/follow", isAuth, userCON.follow);
router.delete("/user/:id/follow", isAuth, userCON.unFollow);

router.get("/users", isAuth, userCON.getAll, userSpec.getAll);

module.exports = router;
