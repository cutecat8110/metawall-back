const express = require("express");
const router = express.Router();
const userCON = require("../controllers/users");
const userSpec = require("../specs/user");
const { isAuth } = require("../service/auth");

router.post("/user/sign_up", userCON.sign_up, userSpec.sign_up);
router.post("/user/sign_in", userCON.sign_in, userSpec.sign_in);

router.get("/user/checkLogin", isAuth, userCON.checkLogin, userSpec.checkLogin);
router.patch(
  "/user/updatePassword",
  isAuth,
  userCON.updatePassword,
  userSpec.updatePassword
);
router.get("/user/profile", isAuth, userCON.getProfile, userSpec.getProfile);
router.patch(
  "/user/profile",
  isAuth,
  userCON.updateProfile,
  userSpec.updateProfile
);
router.get("/user/likeList", isAuth, userCON.getLikeList, userSpec.getLikeList);

router.post("/user/:id/follow", isAuth, userCON.follow, userSpec.follow);
router.delete("/user/:id/follow", isAuth, userCON.unFollow, userSpec.unFollow);

router.get("/users", isAuth, userCON.getAll /* #swagger.ignore = true */);
router.delete("/users", isAuth, userCON.deleteAll /* #swagger.ignore = true */);

module.exports = router;
